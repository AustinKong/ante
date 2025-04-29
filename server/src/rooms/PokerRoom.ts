import { PokerRoomPublicState } from "../types/rooms.types";
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

  join(playerId: string): void {
    super.join(playerId);
    this.playerStates.set(playerId, new PokerPlayerState(1000));
  }

  leave(playerId: string): void {
    super.leave(playerId);
    this.playerStates.delete(playerId);
  }

  onAction(playerId: string, action: { type: string; payload?: any }): void {
    const playerState = this.playerStates.get(playerId);
    if (!playerState) throw new Error("Player not found");

    if (
      this.turnIndex !== this.currentPlayers.findIndex((p) => p.id === playerId)
    ) {
      throw new Error("Not your turn");
    }

    switch (action.type) {
      case "fold":
        playerState.hasFolded = true;
        break;
      case "raiseTo":
        const { amount } = action.payload;
        if (
          typeof amount !== "number" ||
          amount <= 0 ||
          amount > playerState.chips ||
          amount < playerState.lastBet ||
          amount < this.currentBet
        ) {
          throw new Error("Invalid amount");
        }

        const additionalBet = amount - playerState.lastBet;
        playerState.chips -= additionalBet;
        playerState.lastBet = amount;

        this.pot += additionalBet;
        this.currentBet = amount;
        break;
      default:
        throw new Error("Invalid action");
    }
    this.turnIndex = (this.turnIndex + 1) % this.currentPlayers.length;
  }

  serialize(): PokerRoomPublicState {
    return {
      roomCode: this.roomCode,
      roomType: "poker",
      pot: this.pot,
      dealerIndex: this.dealerIndex,
      turnIndex: this.turnIndex,
      currentBet: this.currentBet,
      players: this.currentPlayers.map((player) => ({
        id: player.id,
        username: player.username,
        isHost: player.isHost,
        chips: this.playerStates.get(player.id)?.chips || 0,
        lastBet: this.playerStates.get(player.id)?.lastBet || 0,
        hasFolded: this.playerStates.get(player.id)?.hasFolded || false,
      })),
    };
  }
}
