import { useParams } from "react-router-dom";
import { useRef } from "react";

const GamePage = () => {
  const { roomCode } = useParams();
  const playerRef = useRef(
    localStorage.getItem("player")
      ? JSON.parse(localStorage.getItem("player")!)
      : null
  );

  if (!roomCode) {
    return <div>Invalid room code</div>;
  }

  return (
    <div>
      You have joined room {roomCode} as {playerRef.current?.username}
    </div>
  );
};

export default GamePage;
