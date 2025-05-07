import { Box, Container, Image, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChipImage from "./Chip.png";
import PoissonDiskSampling from "poisson-disk-sampling";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

const CHIP_HEIGHT = 20;
const CHIP_OVERLAP = 13;
const CHIP_MAX_X_OFFSET = 1;
const STAGGER = 0.1;
const DURATION = 0.2;

const POISSON_WIDTH = 300;
const POISSON_HEIGHT = 100;
const POISSON_MIN_DISTANCE = 31;
const POISSON_MAX_DISTANCE = 35;
const SQUASH_Y = 0.85;

const MIN_CHIPS = 3;
const MAX_CHIPS = 10;
const X_EXPONENT = 2; // higher = steeper drop-off along x
const Y_EXPONENT = 1; // higher = steeper drop-off along y

type StackState = {
  chips: { id: number; xOffset: number }[];
  weight: number; // Priority, higher priority means chips are added to here first
  maxChips: number;
  x: number; // Horizontal offset (px)
  y: number; // Vertical offset on the table plane (px)
};

// TODO: This probably can be optimized further
// Increase batchSize to increase the number of chips added/removed at once, helps performance
const ChipPile = ({
  count,
  batchSize = 3,
}: {
  count: number;
  batchSize?: number;
}) => {
  count = Math.floor(count);

  const stackPositions = useMemo(() => {
    const sampler = new PoissonDiskSampling({
      shape: [POISSON_WIDTH, POISSON_HEIGHT],
      minDistance: POISSON_MIN_DISTANCE,
      maxDistance: POISSON_MAX_DISTANCE,
      tries: 10,
    });
    const all = sampler.fill();
    const homeX = POISSON_WIDTH / 2,
      homeY = POISSON_HEIGHT / 2;
    return all.sort((a, b) => {
      const distA = Math.sqrt(
        Math.pow(a[0] - homeX, 2) + Math.pow(a[1] - homeY, 2)
      );
      const distB = Math.sqrt(
        Math.pow(b[0] - homeX, 2) + Math.pow(b[1] - homeY, 2)
      );
      return distA - distB;
    });
  }, []);
  const nextStackIndex = useRef(0);

  function createNewStack(): StackState {
    if (nextStackIndex.current >= stackPositions.length)
      throw new Error("Out of space");

    // x, y relative to center of pile
    const [x, y] = [
      stackPositions[nextStackIndex.current][0] - POISSON_WIDTH / 2,
      stackPositions[nextStackIndex.current++][1] - POISSON_HEIGHT / 2,
    ];

    const xNorm = (2 * Math.abs(x)) / POISSON_WIDTH;
    const yNorm = (y + POISSON_HEIGHT / 2) / POISSON_HEIGHT;

    const slopeX = Math.pow(1 - xNorm, X_EXPONENT);
    const slopeY = Math.pow(1 - yNorm, Y_EXPONENT);
    const slope = slopeX * slopeY;

    const maxChips = Math.round(MIN_CHIPS + slope * (MAX_CHIPS - MIN_CHIPS));
    const weight = maxChips;

    return {
      weight,
      maxChips,
      x: Math.round(x),
      y: -Math.round(y * SQUASH_Y),
      chips: [],
    };
  }

  function getAddStackIndex(stacks: StackState[]): number {
    let index = -1;
    let maxWeight = -1;
    stacks.forEach((stack, i) => {
      if (stack.weight > maxWeight && stack.chips.length < stack.maxChips) {
        maxWeight = stack.weight;
        index = i;
      }
    });
    if (index === -1) {
      stacks.push(createNewStack());
      return stacks.length - 1;
    }
    return index;
  }

  function getRemoveStackIndex(stacks: StackState[]): number {
    let index = -1;
    let minWeight = Number.MAX_VALUE;
    stacks.forEach((stack, i) => {
      if (stack.weight < minWeight && stack.chips.length > 0) {
        minWeight = stack.weight;
        index = i;
      }
    });
    return index;
  }

  const chipIdRef = useRef<number>(0);
  const [stacks, setStacks] = useState<StackState[]>([]);
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
    <Container h="full" overflow="hidden" position="relative" w="full">
      {stacks.map((stack, index) => {
        return (
          <Box
            key={index}
            bottom={`calc(30% + ${stack.y}px)`}
            left={`calc(50% + ${stack.x}px)`}
            position="absolute"
            zIndex={100 - stack.y}
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
    >
      <Image
        draggable={false}
        height={`${CHIP_HEIGHT}px`}
        src={ChipImage}
        style={{
          transform: `translateX(calc(-50% + ${xOffset}px))`,
          filter:
            index === 0 ? `drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.3))` : "",
        }}
      />
    </MotionBox>
  );
};

export default ChipPile;
