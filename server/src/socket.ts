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

      try {
        const room = getRoom(roomCode);
        if (!room) return socket.disconnect(true);

        room.join(playerId);
        socket.join(roomCode);
      } catch (err) {
        return socket.disconnect(true);
      }

      console.log("Player successfully connected to room:", roomCode);

      socket.on("playerAction", ({ roomCode, action }) => {
        io.to(roomCode).emit("gameUpdate", action);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });
  }

  return { io, listen };
}
