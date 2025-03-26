import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

const GamePage = () => {
  const { roomCode } = useParams();
  const socketRef = useRef<Socket | null>(null); // React useStrictMode causes socket to connect twice, thus the need for useRef

  useEffect(() => {
    if (socketRef.current) return;

    const roomToken = localStorage.getItem("roomToken");
    if (!roomToken) return;

    const socket = io("http://localhost:3000", {
      auth: { token: roomToken },
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  if (!roomCode) {
    return <div>Invalid room code</div>;
  }

  return <div>You have joined room {roomCode}</div>;
};

export default GamePage;
