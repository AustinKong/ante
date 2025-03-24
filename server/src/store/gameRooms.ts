type GameRoom = {
  code: string;
  createdAt: number;
};

const gameRooms: Map<string, GameRoom> = new Map();

export function createGameRoom(): GameRoom {
  const code = generateUniqueRoomCode();
  const createdAt = Date.now();
  const gameRoom = { code, createdAt };
  gameRooms.set(code, gameRoom);
  return gameRoom;
}

export function getGameRoom(code: string): GameRoom | undefined {
  return gameRooms.get(code);
}

export function deleteGameRoom(code: string): void {
  gameRooms.delete(code);
}

function generateUniqueRoomCode(): string {
  const characters = "0123456789";
  const breakPoint = 1000;

  for (let i = 0; i < breakPoint; i++) {
    const code = Array.from({ length: 6 })
      .map(() =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      )
      .toString();
    if (!gameRooms.has(code)) {
      return code;
    }
  }

  throw new Error("Failed to generate a unique room code");
}
