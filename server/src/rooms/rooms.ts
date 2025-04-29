import { Room } from "./Room";
import { PokerRoom } from "./PokerRoom";
import { RoomType } from "../types/rooms.types";

const rooms = new Map<string, Room>();

export function createRoom(roomType: RoomType, maxPlayers: number): Room {
  const roomCode = generateUniqueRoomCode();

  let room: Room;
  switch (roomType) {
    case "poker":
      room = new PokerRoom(roomCode, maxPlayers);
      break;
    default:
      throw new Error("Unsupported room type");
  }

  rooms.set(roomCode, room);
  return room;
}

export function getRoom(roomCode: string): Room | undefined {
  return rooms.get(roomCode);
}

function generateUniqueRoomCode(): string {
  const characters = "0123456789";
  const breakPoint = 1000;

  for (let i = 0; i < breakPoint; i++) {
    const code = Array.from({ length: 6 })
      .map(() =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      )
      .join("");
    if (!rooms.has(code)) {
      return code;
    }
  }

  throw new Error("Failed to generate a unique room code");
}
