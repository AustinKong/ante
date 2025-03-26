import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyRoomToken } from "./utils/token";

export function createSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  function listen() {
    io.on("connection", (socket) => {
      socket.on("authJoin", (token: string) => {
        try {
          const { roomCode, playerId } = verifyRoomToken(token) as {
            roomCode: string;
            playerId: string;
          };
          socket.join(roomCode);
        } catch (err) {
          socket.disconnect(true);
        }
      });

      socket.on("joinRoom", (roomCode) => {
        socket.join(roomCode);
      });

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
