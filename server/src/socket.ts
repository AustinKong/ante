import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import socketAuth from "./middleware/socketAuth";
import socketLogger from "./middleware/socketLogger";

import { getRoom } from "./rooms/rooms";

export function createSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  io.use(socketAuth);
  io.use(socketLogger);

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

      // Lets the player know their own identity
      socket.emit("roomJoined", {
        player: room.getPlayer(playerId),
        gameState: room.serialize(),
      });

      // Send event to all other players in the room
      socket.broadcast.to(roomCode).emit("playerJoined", {
        player: room.getPlayer(playerId),
        gameState: room.serialize(),
      });

      socket.on("disconnect", () => {
        socket.broadcast.to(roomCode).emit("playerLeft", {
          player: room.getPlayer(playerId),
          gameState: room.serialize(),
        });
        room.leave(playerId);
      });

      socket.on("playerAction", ({ action }) => {
        room.onAction(playerId, action);
        io.to(roomCode).emit("gameUpdate", {
          gameState: room.serialize(),
        });
      });
    });
  }

  return { io, listen };
}
