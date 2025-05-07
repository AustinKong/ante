import {
  Center,
  Heading,
  VStack,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import AvatarPicker from "@/components/custom/AvatarPicker";

const PlayerCustomizationPage = () => {
  const [playerName, setPlayerName] = useState("");

  const avatars_temp = [
    "https://bit.ly/sage-adebayo",
    "https://bit.ly/dan-abramov",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
  ];

  return (
    <Center h="100vh">
      <VStack gap="2" w="70vw">
        <Heading size="lg">Player Customization</Heading>
        <AvatarPicker avatars={avatars_temp} />
        <Field.Root>
          <Field.Label>Player name</Field.Label>
          <Input
            placeholder="Enter your name"
            type="text"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
          <Field.HelperText>Enter a name for your player</Field.HelperText>
        </Field.Root>
        <Button w="full" onClick={() => console.log(playerName)}>
          Join Game
        </Button>
      </VStack>
    </Center>
  );
};

export default PlayerCustomizationPage;
