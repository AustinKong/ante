import {
  Box,
  Button,
  Center,
  Container,
  Group,
  HStack,
  ProgressCircle,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useGame } from "@/hooks/useGame";

const GamePage = () => {
  const { gameState, playerState } = useGame(
    (player) => {
      toaster.create({
        description: `${player.username} joined the game`,
      });
    },
    (player) => {
      toaster.create({
        description: `${player.username} left the game`,
      });
    }
  );

  if (!gameState) {
    return (
      <Center h="100vh">
        <ProgressCircle.Root value={null} size="lg">
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
      </Center>
    );
  }

  return (
    <Container h="100vh">
      <Toaster />
      <VStack h="full" align="stretch">
        {/* Info */}
        <Box textAlign="center">
          <Heading size="lg">Room Code: {gameState.roomCode}</Heading>
        </Box>
        <HStack gap="4" justifyContent="center">
          {gameState?.players.map((player) => (
            <Box textAlign="center">
              <Text textStyle="md">{player.username}</Text>
              <Text textStyle="sm" color="fg.subtle">
                State
              </Text>
            </Box>
          ))}
        </HStack>
        {/* Game state */}
        <VStack flex="1" align="stretch">
          <Center
            borderWidth="1px"
            borderColor="fg.muted"
            rounded="md"
            flex="1"
          >
            <Text textStyle="md">Pot: ${gameState.pot}</Text>
          </Center>
          <Center
            borderWidth="1px"
            borderColor="fg.muted"
            rounded="md"
            flex="1"
          >
            <Text textStyle="md">Bet: ${gameState?.currentBet}</Text>
          </Center>
          <Center
            borderWidth="1px"
            borderColor="fg.muted"
            rounded="md"
            flex="1"
          >
            <Text textStyle="md">Chips: ${playerState?.chips}</Text>
          </Center>
        </VStack>
        {/* Player actions */}
        <Group gap="4">
          <Button flex="1">Call</Button>
          <Button flex="1">Raise</Button>
          <Button flex="1">Fold</Button>
        </Group>
      </VStack>
    </Container>
  );
};

export default GamePage;
