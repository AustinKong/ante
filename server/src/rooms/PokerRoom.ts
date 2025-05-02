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
    this.playerStates.set(playerId, new PokerPlayerState(5300));
  }

  leave(playerId: string): void {
    super.leave(playerId);
    this.playerStates.delete(playerId);
  }

  // TODO: Handle sidepot logic
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
      case "call":
        const callAmount = this.currentBet - playerState.lastBet;

        if (callAmount > playerState.chips) {
          throw new Error("Not enough chips to call");
        }

        this.pot += callAmount;
        playerState.chips -= callAmount;
        playerState.lastBet = this.currentBet;
        break;
      case "check":
        if (this.currentBet > playerState.lastBet) {
          throw new Error("You must call or raise to check");
        }
        break;
      // Encapsulates raise and bet
      case "raiseTo":
        const { amount } = action.payload;
        const raiseAmount = amount - playerState.lastBet;

        if (
          !amount ||
          amount <= this.currentBet ||
          amount < playerState.lastBet ||
          raiseAmount > playerState.chips
        ) {
          throw new Error("Invalid bet/raise amount");
        }

        playerState.chips -= raiseAmount;
        playerState.lastBet = amount;
        this.pot += raiseAmount;
        this.currentBet = amount;
        break;
      case "allIn":
        const allInAmount = playerState.chips;

        if (playerState.chips <= 0) {
          throw new Error("You are already all in");
        }

        playerState.lastBet += allInAmount;
        this.pot += allInAmount;
        playerState.chips -= allInAmount;

        if (playerState.lastBet > this.currentBet) {
          this.currentBet = playerState.lastBet;
        }
        break;
      default:
        throw new Error("Invalid action");
    }

    let loopCount = 0;
    do {
      this.turnIndex = (this.turnIndex + 1) % this.currentPlayers.length;
      loopCount++;
      if (loopCount > this.currentPlayers.length) {
        throw new Error("No eligible players left to act");
      }
    } while (
      this.playerStates.get(this.currentPlayers[this.turnIndex].id)
        ?.hasFolded ||
      this.playerStates.get(this.currentPlayers[this.turnIndex].id)?.chips === 0
    );
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
