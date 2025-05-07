import {
  Center,
  Heading,
  VStack,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AvatarPicker from "@/components/custom/AvatarPicker";

const AVATARS = Array.from(
  { length: 9 },
  (_, i) => `/avatars/avatar${i.toString().padStart(2, "0")}.png`
);

const PlayerCustomizationPage = () => {
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || ""
  );
  const [avatar, setAvatar] = useState(0);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const roomToken = localStorage.getItem("roomToken");
    const response = await fetch(`/api/game/${roomCode}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, avatar, roomToken }),
    });

    if (response.ok) {
      navigate(`/game/${roomCode}`);
    } else {
      setUsername("");
    }
  };

  return (
    <Center h="100vh">
      <VStack gap="2" w="70vw">
        <Heading size="lg">Player Customization</Heading>
        <AvatarPicker
          avatars={AVATARS}
          onChange={(index) => setAvatar(index)}
        />
        <Field.Root>
          <Field.Label>Player name</Field.Label>
          <Input
            placeholder="Enter your name"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Field.HelperText>Enter a name for your player</Field.HelperText>
        </Field.Root>
        <Button w="full" onClick={handleSubmit}>
          Join Game
        </Button>
      </VStack>
    </Center>
  );
};

export default PlayerCustomizationPage;
