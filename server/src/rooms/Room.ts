import { Player } from "../players/Player";

export class Room {
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

    this.pendingPlayers.set(player.id, {
      player,
      timeout: setTimeout(() => {
        this.pendingPlayers.delete(player.id);
        console.log(`Player ${player.id} timed out`);
      }, 30000), // Connection timeout
    });
  }

  join(playerId: string): void {
    const pendingPlayer = this.pendingPlayers.get(playerId);

    if (this.isFull()) throw new Error("Room is full");
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
}
