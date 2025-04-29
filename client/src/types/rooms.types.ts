export type RoomType = "poker" | "blackjack";

export interface RoomPublicState {
  roomCode: string;
  roomType: RoomType;
  players: {
    id: string;
    username: string;
    isHost: boolean;
  }[];
}

export interface PokerRoomPublicState extends RoomPublicState {
  pot: number;
  dealerIndex: number;
  turnIndex: number;
  currentBet: number;
  players: {
    id: string;
    username: string;
    isHost: boolean;
    chips: number;
    lastBet: number;
    hasFolded: boolean;
  }[];
}

export interface BlackjackRoomPublicState extends RoomPublicState {
  players: {
    id: string;
    username: string;
    isHost: boolean;
    chips: number;
  }[];
}
