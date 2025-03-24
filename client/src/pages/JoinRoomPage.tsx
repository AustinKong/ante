import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";

const JoinGamePage = () => {
  const [gameCode, setGameCode] = useState("");

  return (
    <div>
      <InputOTP
        maxLength={6}
        value={gameCode}
        onChange={(value) => setGameCode(value)}
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default JoinGamePage;
