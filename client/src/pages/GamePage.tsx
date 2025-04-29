import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GamePage = () => {
  const { roomCode } = useParams();
  const [alerts, setAlerts] = useState<string[]>([]);
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
      addAlert(`Player ${player.id} joined`);
    });

    socket.on("playerLeft", ({ playerId }) => {
      addAlert(`Player ${playerId} left`);
    });

    socket.on("gameUpdate", (publicRoomState) => {
      console.log("Game update received:", publicRoomState);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const addAlert = (alert: string) => {
    setAlerts((prev) => [...prev, alert]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a !== alert));
    }, 3000);
  };

  // Debug
  const [debugAction, setDebugAction] = useState<string>("");
  const [debugActionPayload, setDebugActionPayload] = useState<string>("");

  if (!roomCode) {
    return <div>Invalid room code</div>;
  }

  return (
    <div>
      {alerts.map((alert, index) => (
        <Alert key={index}>
          <AlertTitle>Alert</AlertTitle>
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      ))}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          value={debugAction}
          onChange={(e) => setDebugAction(e.target.value)}
          placeholder="Action"
        />
        <textarea
          value={debugActionPayload}
          onChange={(e) => setDebugActionPayload(e.target.value)}
          placeholder="Action Payload"
        />
        <button
          onClick={() => {
            if (socketRef.current) {
              socketRef.current.emit("playerAction", {
                action: {
                  type: debugAction,
                  payload: debugActionPayload
                    ? JSON.parse(debugActionPayload)
                    : "",
                },
              });
            }
          }}
        >
          Send Action
        </button>
      </div>
    </div>
  );
};

export default GamePage;
