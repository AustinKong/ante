import { Socket } from "socket.io";
import { verifyRoomToken } from "../utils/token";

function socketAuth(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token;

  try {
    const { roomCode, playerId } = verifyRoomToken(token) as {
      roomCode: string;
      playerId: string;
    };
    socket.data.roomCode = roomCode;
    socket.data.playerId = playerId;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}

export default socketAuth;
