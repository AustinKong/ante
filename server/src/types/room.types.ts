import { Player } from "./player.types";

export interface GameRoom {
  // Metadata
  roomCode: string;
  createdAt: number;
  maxPlayers: number;
  gameType: GameType;
  // State
  players: Player[];
}

export type GameType = "poker" | "blackjack";
