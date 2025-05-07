import { Player } from "../players/Player";
import { RoomPublicState } from "../types/rooms.types";

const TIMEOUT_INTERVAL = 60000;

export abstract class Room {
  roomCode: string;
  createdAt: number = Date.now();
  maxPlayers: number;
  currentPlayers: Player[] = [];
  pendingPlayers: Map<string, { player: Player; timeout: NodeJS.Timeout }> =
    new Map();

  constructor(roomCode: string, maxPlayers: number) {
    this.roomCode = roomCode;
    this.maxPlayers = maxPlayers;
  }

  isFull(): boolean {
    return (
      this.currentPlayers.length + this.pendingPlayers.size >= this.maxPlayers
    );
  }

  reserve(player: Player): void {
    if (this.isFull()) throw new Error("Room is full");
    if (
      this.currentPlayers.some((p) => p.username === player.username) ||
      Array.from(this.pendingPlayers.values()).some(
        (p) => p.player.username === player.username
      )
    )
      throw new Error("Player username must be unique");

    this.pendingPlayers.set(player.id, {
      player,
      timeout: setTimeout(() => {
        this.pendingPlayers.delete(player.id);
        console.log(`Player ${player.id} timed out`);
      }, TIMEOUT_INTERVAL), // Connection timeout
    });
  }

  join(playerId: string): void {
    const pendingPlayer = this.pendingPlayers.get(playerId);

    if (!pendingPlayer) throw new Error("Player not found");

    clearTimeout(pendingPlayer.timeout);
    this.pendingPlayers.delete(playerId);
    this.currentPlayers.push(pendingPlayer.player);
  }

  leave(playerId: string): void {
    const pending = this.pendingPlayers.get(playerId);

    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingPlayers.delete(playerId);
    } else {
      this.currentPlayers = this.currentPlayers.filter(
        (player) => player.id !== playerId
      );
    }
  }

  getPlayer(playerId: string): Player | undefined {
    return (
      this.currentPlayers.find((player) => player.id === playerId) ||
      this.pendingPlayers.get(playerId)?.player
    );
  }

  getNewPlayer(isHost: boolean): Player {
    do {
      const player = new Player(isHost);
      if (!this.currentPlayers.some((p) => p.username === player.username)) {
        return player;
      }
    } while (true);
  }

  abstract onAction(
    playerId: string,
    action: { type: string; payload?: any }
  ): void;

  abstract serialize(): RoomPublicState;
}
