import {
  Box,
  Center,
  Container,
  Grid,
  ProgressCircle,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useGame } from "@/hooks/useGame";
import {
  CasinoOutlined,
  CheckCircleOutlined,
  PanToolOutlined,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";
import ChipPile from "@/components/custom/ChipPile";
import ActionBar from "@/components/custom/ActionBar";

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
    <Container h="100vh" p="2">
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
          <VStack alignItems="center" flex="1" gap="2">
            <Text textStyle="lg">Pot: ${gameState.pot}</Text>
            <ChipPile count={gameState.pot / 20} />
          </VStack>

          <VStack alignItems="center" flex="1" gap="2">
            <Text textStyle="md">Current bet: ${gameState.currentBet}</Text>
            <Text textStyle="md">Your bet: ${playerState.lastBet}</Text>
            <ChipPile count={playerState.lastBet / 20} />
          </VStack>

          <VStack alignItems="center" flex="1" gap="2">
            <Text textStyle="md">Chips: ${playerState.chips}</Text>
            <ChipPile count={playerState.chips / 20} />
          </VStack>
        </VStack>
        {/* Player actions */}
        <ActionBar
          actions={[
            {
              label:
                gameState.currentBet > playerState.lastBet ? "Call" : "Check",
              icon: <CheckCircleOutlined />,
              onClick:
                gameState.currentBet > playerState.lastBet
                  ? handleCall
                  : handleCheck,
            },
            {
              label: gameState.currentBet === 0 ? "Bet" : "Raise To",
              icon: <CasinoOutlined />,
              onClick: () => {},
              sliderConfig: {
                min: gameState.currentBet + 1,
                max: playerState.chips + gameState.currentBet,
                title: gameState.currentBet === 0 ? "Bet" : "Raise To",
                onSubmit:
                  gameState.currentBet === 0 ? handleBet : handleRaiseTo,
              },
            },
            {
              label: "Fold",
              icon: <PanToolOutlined />,
              onClick: handleFold,
            },
            {
              label: "All In",
              icon: <AccountBalanceWalletOutlined />,
              onClick: handleAllIn,
            },
          ]}
          disabled={!isTurn}
        />
      </VStack>
    </Container>
  );
};

export default GamePage;
