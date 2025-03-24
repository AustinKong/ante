import { Player } from "./players";

type GameRoom = {
  roomCode: string;
  createdAt: number;
  maxPlayers: number;
  players: Player[];
};

const gameRooms: Map<string, GameRoom> = new Map();

export function createGameRoom(maxPlayers: number): GameRoom {
  const roomCode = generateUniqueRoomCode();
  const room = { roomCode, createdAt: Date.now(), maxPlayers, players: [] };
  gameRooms.set(roomCode, room);
  return room;
}

export function getGameRoom(roomCode: string): GameRoom | undefined {
  const room = gameRooms.get(roomCode);
  // Remove player IDs before sending the room data to the client
  room?.players.forEach((player) => {
    delete player.id;
  });
  return room;
}

export function deleteGameRoom(roomCode: string): void {
  gameRooms.delete(roomCode);
}

export function joinGameRoom(roomCode: string, player: Player): boolean {
  const room = gameRooms.get(roomCode);
  if (!room || room.players.length >= room.maxPlayers) return false;

  room.players.push(player);
  return true;
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
    if (!gameRooms.has(code)) {
      return code;
    }
  }

  throw new Error("Failed to generate a unique room code");
}
