import { Box, Container, Image, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ChipImage from "./Chip.png";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

const PILE_Y_SCALE = 0.992; // As pile is further to "camera" it gets scaled by this y-scale
const CHIP_HEIGHT = 20;
const CHIP_OVERLAP = 13;
const CHIP_MAX_X_OFFSET = 1;
const STAGGER = 0.05;
const DURATION = 0.2;

interface ChipStack3D {
  weight: number; // Priority, higher priority means chips are added to here first
  maxChips: number;
  x: number; // Horizontal offset (px)
  y: number; // Vertical offset on the table plane (px)
}

interface ChipPile3D {
  stacks: ChipStack3D[];
}

const CHIP_PILES: ChipPile3D[] = [
  {
    stacks: [
      { weight: 1, maxChips: 3, x: -40, y: -25 },
      { weight: 2, maxChips: 8, x: 10, y: -20 },
      { weight: 3, maxChips: 11, x: 30, y: -5 },
      { weight: 4, maxChips: 12, x: -20, y: 0 },
      { weight: 5, maxChips: 16, x: 15, y: 10 },
    ],
  },
];

type StackState = {
  chips: { id: number; xOffset: number }[];
} & ChipStack3D;

function getAddStackIndex(stacks: StackState[]): number {
  let index = 0;
  let maxWeight = -1;
  stacks.forEach((stack, i) => {
    if (stack.weight > maxWeight && stack.chips.length < stack.maxChips) {
      maxWeight = stack.weight;
      index = i;
    }
  });
  return index;
}

function getRemoveStackIndex(stacks: StackState[]): number {
  let index = 0;
  let minWeight = Number.MAX_VALUE;
  stacks.forEach((stack, i) => {
    if (stack.weight < minWeight && stack.chips.length > 0) {
      minWeight = stack.weight;
      index = i;
    }
  });
  return index;
}

// Increase batchSize to increase the number of chips added/removed at once, helps performance
const ChipPile = ({
  count,
  batchSize = 3,
}: {
  count: number;
  batchSize?: number;
}) => {
  count = Math.floor(count);

  const chipIdRef = useRef<number>(0);
  const [stacks, setStacks] = useState<StackState[]>(() =>
    CHIP_PILES[Math.floor(Math.random() * CHIP_PILES.length)].stacks.map(
      (stack) => ({
        ...stack,
        chips: [],
      })
    )
  );
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) return;
    if (stacks.reduce((acc, stack) => acc + stack.chips.length, 0) === count)
      return;

    setStacks((prev) => {
      const totalChips = prev.reduce(
        (acc, stack) => acc + stack.chips.length,
        0
      );
      setTimeout(() => setIsAnimating(false), STAGGER * 1000);
      setIsAnimating(true);
      if (totalChips < count) {
        const index = getAddStackIndex(prev);
        return prev.map((stack, i) => ({
          ...stack,
          chips:
            i === index
              ? [
                  ...stack.chips,
                  ...Array.from(
                    { length: Math.min(batchSize, count - totalChips) },
                    () => ({
                      id: chipIdRef.current++,
                      xOffset: Math.round(
                        Math.random() * (CHIP_MAX_X_OFFSET * 2) -
                          CHIP_MAX_X_OFFSET
                      ),
                    })
                  ),
                ]
              : stack.chips,
        }));
      } else {
        const index = getRemoveStackIndex(prev);
        return prev.map((stack, i) => ({
          ...stack,
          chips:
            i === index
              ? stack.chips.slice(0, -Math.min(batchSize, totalChips - count))
              : stack.chips,
        }));
      }
    });
  }, [batchSize, count, isAnimating, stacks]);

  return (
    <Container height="full" position="relative" w="full">
      {stacks.map((stack, index) => {
        const scale = Math.pow(PILE_Y_SCALE, stack.y);
        return (
          <Box
            key={index}
            bottom={`calc(25% + ${stack.y}px)`}
            left={`calc(50% + ${stack.x}px)`}
            position="absolute"
            style={{ transform: `scale(${scale})` }}
            transformOrigin="center bottom"
            zIndex={-stack.y}
          >
            <Stack chips={stack.chips} />
          </Box>
        );
      })}
    </Container>
  );
};

const chipVariants = {
  hide: {
    opacity: 0,
    y: "-20px",
    transition: {
      duration: DURATION,
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.5,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION,
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.5,
    },
  },
};

const Stack = ({ chips }: { chips: { id: number; xOffset: number }[] }) => {
  return (
    <MotionVStack flexDirection="column-reverse" gap="0">
      <AnimatePresence initial={true}>
        {chips.map((chip, i) => {
          return <Chip key={chip.id} index={i} xOffset={chip.xOffset} />;
        })}
      </AnimatePresence>
    </MotionVStack>
  );
};

const Chip = ({ index, xOffset }: { index: number; xOffset: number }) => {
  return (
    <MotionBox
      animate="show"
      exit="hide"
      height={`${CHIP_HEIGHT - CHIP_OVERLAP}px`}
      initial="hide"
      overflowY="visible"
      variants={chipVariants}
      zIndex={index}
      layout
    >
      <Image
        draggable={false}
        height={`${CHIP_HEIGHT}px`}
        src={ChipImage}
        style={{ transform: `translateX(${xOffset}px)` }}
      />
    </MotionBox>
  );
};

export default ChipPile;
