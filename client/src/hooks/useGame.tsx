import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import {
  PokerRoomPublicState,
  // BlackjackRoomPublicState,
} from "@/types/rooms.types";

interface Player {
  id: string;
  username: string;
  isHost: boolean;
}

type RoomPublicState = PokerRoomPublicState;

export const useGame = (
  onPlayerJoined?: (player: Player) => void,
  onPlayerLeft?: (player: Player) => void,
  onGameUpdate?: (gameState: RoomPublicState) => void
) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<RoomPublicState | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const playerState = gameState?.players.find((p) => p.id === player?.id);

  useEffect(() => {
    if (socketRef.current) return;
    const roomToken = localStorage.getItem("roomToken");
    if (!roomToken) return;

    // TODO: Put this in .env
    const socket = io("http://localhost:3000", {
      auth: { token: roomToken },
    });
    socketRef.current = socket;

    socket.on("roomJoined", ({ player: self, gameState }) => {
      setPlayer(self);
      setGameState(gameState);
      onPlayerJoined?.(self);
      onGameUpdate?.(gameState);
    });

    socket.on("playerJoined", ({ player }) => {
      onPlayerJoined?.(player);
    });

    socket.on("playerLeft", ({ player }) => {
      onPlayerLeft?.(player);
    });

    socket.on("gameUpdate", (gameState: RoomPublicState) => {
      setGameState(gameState);
      onGameUpdate?.(gameState);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendAction = (actionType: string, payload?: any) => {
    if (!socketRef.current) return;
    socketRef.current.emit("playerAction", {
      action: { type: actionType, payload },
    });
  };

  return {
    player,
    gameState,
    playerState,
    setPlayer,
    setGameState,
    sendAction,
  };
};
