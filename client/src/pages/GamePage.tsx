import {
  Box,
  Center,
  Container,
  ProgressCircle,
  Heading,
  VStack,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useGame } from "@/hooks/useGame";
import {
  CasinoOutlined,
  CheckCircleOutlined,
  PanToolOutlined,
  AccountBalanceWalletOutlined,
  ChevronLeft,
  PauseOutlined,
} from "@mui/icons-material";
import ChipPile from "@/components/custom/ChipPile";
import ActionBar from "@/components/custom/ActionBar";
import FiniteCarousel from "@/components/custom/FiniteCarousel";
import TurnCarousel from "@/components/custom/TurnCarousel";

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

  return (
    <Container h="100svh" p="2">
      <Toaster />

      <VStack align="stretch" h="full">
        {/* Info */}
        <HStack
          alignItems="center"
          justifyContent="space-between"
          mb="2"
          textAlign="center"
        >
          <IconButton variant="ghost">
            <ChevronLeft />
          </IconButton>
          <Heading size="lg">TEMPORARY</Heading>
          <IconButton variant="ghost">
            <PauseOutlined />
          </IconButton>
        </HStack>
        <TurnCarousel
          players={players.map((player) => ({
            username: player.id === playerState.id ? "You" : player.username,
            avatar: `/avatars/avatar${player.avatar
              .toString()
              .padStart(2, "0")}.png`,
            chips: player.chips,
            statusText:
              player.id === players[turnIndex].id
                ? "Thinking..."
                : player.hasFolded
                ? "Folded"
                : `$${player.lastBet}`,
          }))}
          turnIndex={turnIndex}
        />

        {/* Game state */}
        <FiniteCarousel>
          <VStack w="full">
            <VStack gap="0">
              <Heading color="fg.subtle" size="sm">
                Pot
              </Heading>
              <Heading fontWeight="bolder" size="5xl">
                ${gameState.pot}
              </Heading>
            </VStack>
            <Box h="35vh" w="full">
              <ChipPile count={gameState.pot / 20} />
            </Box>
          </VStack>

          <VStack w="full">
            <VStack gap="0">
              <Heading color="fg.subtle" size="sm">
                Current Bet
              </Heading>
              <Heading size="3xl">${gameState.currentBet}</Heading>
            </VStack>
            <VStack gap="0">
              <Heading color="fg.subtle" size="sm">
                Your Bet
              </Heading>
              <Heading size="3xl">${playerState.lastBet}</Heading>
            </VStack>
            <Box h="35vh" w="full">
              <ChipPile count={playerState.lastBet / 20} />
            </Box>
          </VStack>

          <VStack w="full">
            <VStack gap="0">
              <Heading color="fg.subtle" size="sm">
                Your chips
              </Heading>
              <Heading fontWeight="bolder" size="5xl">
                ${playerState.chips}
              </Heading>
            </VStack>
            <Box h="35vh" w="full">
              <ChipPile count={playerState.chips / 20} />
            </Box>
          </VStack>
        </FiniteCarousel>

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
