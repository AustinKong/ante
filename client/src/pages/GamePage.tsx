import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Center, Heading } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

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

    // TODO: Extract socket event listeners to a separate file for better organization
    socket.on("playerJoined", ({ player }) => {
      toaster.create({
        description: `${player.username} joined the room`,
      });
    });

    socket.on("playerLeft", ({ player }) => {
      toaster.create({
        description: `${player.username} left the room`,
      });
    });

    socket.on("gameUpdate", (publicRoomState) => {
      console.log("Game update received:", publicRoomState);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  if (!roomCode) {
    return (
      <Center h="100vh">
        <Heading>Invalid room code</Heading>
      </Center>
    );
  }

  return (
    <Center h="100vh">
      <Toaster />
    </Center>
  );
};

export default GamePage;
