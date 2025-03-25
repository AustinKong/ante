import { GameRoom } from "./room.types";

type PokerPlayerState = {
  chips: number;
  lastBet: number;
  hasFolded: boolean;
};

export interface PokerRoom extends GameRoom {
  gameType: "poker";
  pot: number;
  dealerIndex: number;
  turnIndex: number;
  currentBet: number;
  playerStates: Map<string, PokerPlayerState>;
}
