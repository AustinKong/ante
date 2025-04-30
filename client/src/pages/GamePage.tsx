import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Grid,
  ProgressCircle,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import BetButton from "@/components/custom/BetButton";
import { useGame } from "@/hooks/useGame";

const GamePage = () => {
  const { gameState, playerState, isTurn, sendAction } = useGame(
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

  const handleCall = () => {
    if (!gameState || !playerState) return;
    sendAction("call");
  };

  const handleCheck = () => {
    if (!gameState || !playerState) return;
    sendAction("check");
  };

  const handleRaiseTo = (amount: number) => {
    if (!gameState || !playerState) return;
    sendAction("raiseTo", { amount });
  };

  const handleBet = (amount: number) => {
    if (!gameState || !playerState) return;
    sendAction("raiseTo", { amount });
  };

  const handleFold = () => {
    if (!gameState || !playerState) return;
    sendAction("fold");
  };

  const handleAllIn = () => {
    if (!gameState || !playerState) return;
    sendAction("allIn");
  };

  if (!gameState || !playerState) {
    return (
      <Center h="100vh">
        <ProgressCircle.Root size="lg" value={null}>
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
      </Center>
    );
  }

  const { players, turnIndex } = gameState;
  const displayedPlayers =
    players.length >= 3
      ? [
          players[(turnIndex - 1 + players.length) % players.length],
          players[turnIndex],
          players[(turnIndex + 1) % players.length],
        ]
      : players;

  return (
    <Container h="100vh">
      <Toaster />
      <VStack align="stretch" h="full">
        {/* Info */}
        <Box textAlign="center">
          <Heading size="lg">Room Code: {gameState.roomCode}</Heading>
        </Box>
        <Grid gap="4" templateColumns="1fr auto 1fr">
          {displayedPlayers.map((player) => {
            const isCurrent = player.id === players[turnIndex].id;

            return (
              <Box
                key={player.id}
                color={isCurrent ? "fg" : "fg.muted"}
                textAlign="center"
              >
                <Text textStyle="md">
                  {player.id === playerState.id ? "You" : player.username}
                </Text>
                <Text color="fg.subtle" textStyle="sm">
                  {player.hasFolded ? "Folded" : `$${player.lastBet}`}
                </Text>
              </Box>
            );
          })}
        </Grid>
        {/* Game state */}
        <VStack align="stretch" flex="1">
          <Center
            borderColor="fg.muted"
            borderWidth="1px"
            flex="1"
            rounded="md"
          >
            <Text textStyle="md">Pot: ${gameState.pot}</Text>
          </Center>
          <Center
            borderColor="fg.muted"
            borderWidth="1px"
            flex="1"
            flexDir="column"
            rounded="md"
          >
            <Text textStyle="md">Current bet: ${gameState.currentBet}</Text>
            <Text textStyle="md">Your bet: ${playerState.lastBet}</Text>
          </Center>
          <Center
            borderColor="fg.muted"
            borderWidth="1px"
            flex="1"
            rounded="md"
          >
            <Text textStyle="md">Chips: ${playerState.chips}</Text>
          </Center>
        </VStack>
        {/* Player actions */}
        <Group grow gap="4">
          <Button
            disabled={!isTurn}
            onClick={
              gameState.currentBet > playerState.lastBet
                ? handleCall
                : handleCheck
            }
          >
            {gameState.currentBet > playerState.lastBet ? "Call" : "Check"}
          </Button>
          <BetButton
            disabled={!isTurn}
            max={playerState.chips}
            min={gameState.currentBet + 1}
            text={gameState.currentBet === 0 ? "Bet" : "Raise To"}
            onSubmit={gameState.currentBet === 0 ? handleBet : handleRaiseTo}
          />
          <Button disabled={!isTurn} onClick={handleFold}>
            Fold
          </Button>
          <Button disabled={!isTurn} onClick={handleAllIn}>
            All In
          </Button>
        </Group>
      </VStack>
    </Container>
  );
};

export default GamePage;
