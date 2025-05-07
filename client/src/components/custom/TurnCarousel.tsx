import { Heading, VStack, Text, HStack, Box, Avatar } from "@chakra-ui/react";
import { motion, useMotionValue, animate } from "motion/react";
import { useEffect } from "react";
import useMeasure from "@/hooks/useMeasure";

const MotionBox = motion.create(Box);

type Player = {
  username: string;
  chips: number;
  statusText: string;
};

const TurnCarousel = ({
  players,
  turnIndex,
}: {
  players: Player[];
  turnIndex: number;
}) => {
  const [ref, { width }] = useMeasure();
  const cardWidth = players.length ? width / Math.min(players.length, 5) : 0;
  const x = useMotionValue(0);

  const extendedPlayers = [...players, ...players, ...players];

  useEffect(() => {
    x.set(cardWidth * -players.length);
  }, [cardWidth, players.length, x]);

  useEffect(() => {
    const targetX = -cardWidth * (turnIndex + players.length);
    animate(x, targetX, {
      duration: 0.2,
      ease: "easeInOut",
      onComplete: () => {
        if (turnIndex === players.length - 1) {
          x.set(cardWidth * (1 - players.length)); // Jump to start
        }
      },
    });
  }, [turnIndex, cardWidth, players.length, x]);

  return (
    <HStack ref={ref} overflow="clip" w="full">
      <MotionBox
        display="flex"
        pointerEvents="none"
        style={{ x }}
        width="max-content"
      >
        {extendedPlayers.map((player, index) => (
          <PlayerCard key={index} cardWidth={cardWidth} player={player} />
        ))}
      </MotionBox>
    </HStack>
  );
};

const PlayerCard = ({
  cardWidth,
  player,
}: {
  cardWidth: number;
  player: Player;
}) => {
  return (
    <VStack gap="0" w={cardWidth}>
      <Heading aria-label={`Player: ${player.username}`} size="sm">
        {player.username}
      </Heading>
      <Avatar.Root size="sm">
        <Avatar.Image src="https://bit.ly/broken-link" />
        <Avatar.Fallback>{player.username[0].toUpperCase()}</Avatar.Fallback>
      </Avatar.Root>
      <Text color="fg.subtle" fontSize="sm">
        {player.statusText}
      </Text>
    </VStack>
  );
};

export default TurnCarousel;
