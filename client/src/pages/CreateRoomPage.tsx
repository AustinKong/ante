import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Center,
  VStack,
  Heading,
  Field,
  Input,
  Button,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { authFetch } from "@/utils/authFetch";

const GAME_MODES = createListCollection({
  items: [
    { label: "Poker (Texas Hold'em)", value: "poker" },
    { label: "Blackjack", value: "blackjack" },
    { label: "Gnau", value: "gnau" },
  ],
});

const CreateRoomPage = () => {
  const [maxPlayers, setMaxPlayers] = useState<string>("2");
  const [gameMode, setGameMode] = useState<string>("poker");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await authFetch("/api/game/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maxPlayers: parseInt(maxPlayers, 10) }),
    });

    if (response.ok) {
      const { roomCode, roomToken } = await response.json();
      localStorage.setItem("roomToken", roomToken);
      navigate(`/game/${roomCode}`);
    } else {
      navigate("/login");
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
            onChange={(event) => setMaxPlayers(event.target.value.trim())}
          />
          <Field.HelperText>Max players in the room</Field.HelperText>
        </Field.Root>

        {/* FIXME: Use something more suitable than select, since we want to add description texts to each game */}
        <Select.Root
          collection={GAME_MODES}
          value={[gameMode]}
          onValueChange={(event) => setGameMode(event.value[0])}
        >
          <Select.HiddenSelect />
          <Select.Label>Game mode</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select game mode" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {GAME_MODES.items.map((item) => (
                  <Select.Item key={item.value} item={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Button w="100%" onClick={handleSubmit}>
          Create Room
        </Button>
      </VStack>
    </Center>
  );
};

export default CreateRoomPage;
