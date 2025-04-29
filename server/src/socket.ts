import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import socketAuth from "./middleware/socketAuth";

import { getRoom } from "./rooms/rooms";

export function createSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  io.use(socketAuth);

  function listen() {
    io.on("connection", (socket) => {
      const { roomCode, playerId } = socket.data;
      const room = getRoom(roomCode);

      if (!room) return socket.disconnect(true);

      try {
        room.join(playerId);
        socket.join(roomCode);
      } catch (err) {
        return socket.disconnect(true);
      }

      // Send required information to joined player
      socket.emit("roomJoined", {
        player: room.getPlayer(playerId),
        gameState: room.serialize(),
      });

      // Send event to all other players in the room
      socket.broadcast.to(roomCode).emit("playerJoined", {
        player: room.getPlayer(playerId),
      });

      socket.on("disconnect", () => {
        room.leave(playerId);
        socket.broadcast
          .to(roomCode)
          .emit("playerLeft", room.getPlayer(playerId));
      });

      socket.on("playerAction", ({ action }) => {
        room.onAction(playerId, action);
        const publicRoomState = room.serialize();
        io.to(roomCode).emit("gameUpdate", publicRoomState);
      });
    });
  }

  return { io, listen };
}
