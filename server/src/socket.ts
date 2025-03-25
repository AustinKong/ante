import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export function createSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  function listen() {
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

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
