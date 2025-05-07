export type RoomType = "poker" | "blackjack";

type Player = {
  id: string;
  username: string;
  isHost: boolean;
  avatar: number;
};

export interface RoomPublicState {
  roomCode: string;
  roomType: RoomType;
  players: Player[];
}

export interface PokerRoomPublicState extends RoomPublicState {
  pot: number;
  dealerIndex: number;
  turnIndex: number;
  currentBet: number;
  players: (Player & {
    chips: number;
    lastBet: number;
    hasFolded: boolean;
  })[];
}

export interface BlackjackRoomPublicState extends RoomPublicState {
  players: (Player & {
    chips: number;
  })[];
}
