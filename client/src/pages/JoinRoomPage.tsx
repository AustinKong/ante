import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinGamePage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = async () => {
    const response = await fetch("/api/game/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomCode }),
    });

    if (response.ok) {
      const { roomToken } = await response.json();
      localStorage.setItem("roomToken", roomToken);
      navigate(`/game/${roomCode}`);
    }
  };

  return (
    <div>
      <InputOTP
        maxLength={6}
        value={roomCode}
        onChange={(value) => setRoomCode(value)}
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button onClick={handleSubmit}>Join Game</Button>
    </div>
  );
};

export default JoinGamePage;
