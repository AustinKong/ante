import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Center,
  VStack,
  Heading,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";
import { authFetch } from "@/utils/authFetch";

const CreateRoomPage = () => {
  const [maxPlayers, setMaxPlayers] = useState(2);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await authFetch("/api/game/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maxPlayers }),
    });

    if (response.ok) {
      const { roomCode, roomToken } = await response.json();
      localStorage.setItem("roomToken", roomToken);
      navigate(`/game/${roomCode}`);
    }
  };

  return (
    <Center h="100vh">
      <VStack gap="2">
        <Heading size="lg">Create Room</Heading>
        <Field.Root>
          <Field.Label>Max Players</Field.Label>
          <Input
            placeholder="Enter max players"
            value={maxPlayers}
            onChange={(event) =>
              setMaxPlayers(parseInt(event.target.value, 10))
            }
          />
          <Field.HelperText>Max players in the room</Field.HelperText>
        </Field.Root>
        <Button w="100%" onClick={handleSubmit}>
          Create Room
        </Button>
      </VStack>
    </Center>
  );
};

export default CreateRoomPage;
