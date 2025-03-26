import { Room } from "./Room";

class PokerPlayerState {
  chips: number;
  lastBet: number = 0;
  hasFolded: boolean = false;

  constructor(chips: number) {
    this.chips = chips;
  }
}

export class PokerRoom extends Room {
  pot: number = 0;
  dealerIndex: number = 0;
  turnIndex: number = 0;
  currentBet: number = 0;
  playerStates = new Map<string, PokerPlayerState>();

  constructor(roomCode: string, maxPlayers: number) {
    super(roomCode, maxPlayers);
  }
}
