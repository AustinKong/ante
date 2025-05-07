import {
  Center,
  VStack,
  Heading,
  Field,
  PinInput,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinGamePage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = async () => {
    const response = await fetch(`/api/game/${roomCode}/validate`);

    if (response.ok) {
      const { roomCode, player, roomToken } = await response.json();
      sessionStorage.setItem("username", player.username);
      localStorage.setItem("roomToken", roomToken); // Store in localStorage to enable rejoining
      navigate(`/game/${roomCode}/playerCustomization`);
    } else {
      setRoomCode("");
    }
  };

  return (
    <Center h="100vh">
      <VStack gap="2">
        <Heading size="lg">Join Game</Heading>
        <Field.Root>
          <Field.Label>Room Code</Field.Label>
          <PinInput.Root
            otp
            placeholder=" "
            value={roomCode
              .padEnd(6, " ")
              .split("")
              .map((c) => (c === " " ? "" : c))}
            onValueChange={(event) => setRoomCode(event.value.join(""))}
          >
            <PinInput.HiddenInput />
            <PinInput.Control>
              <PinInput.Input index={0} />
              <PinInput.Input index={1} />
              <PinInput.Input index={2} />
              <PinInput.Input index={3} />
              <PinInput.Input index={4} />
              <PinInput.Input index={5} />
            </PinInput.Control>
          </PinInput.Root>
          <Field.HelperText>Enter the room code to join</Field.HelperText>
        </Field.Root>
        <Button w="100%" onClick={handleSubmit}>
          Join Game
        </Button>
      </VStack>
    </Center>
  );
};

export default JoinGamePage;
