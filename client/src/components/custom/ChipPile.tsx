import { Box, Container, Image, VStack } from "@chakra-ui/react";
import ChipImage from "./Chip.png";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

const PILE_Y_SCALE = 0.992; // As pile is further to "camera" it gets scaled by this y-scale

interface ChipStack3D {
  weight: number; // Priority, higher priority means chips are added to here first
  maxChips: number;
  x: number; // Horizontal offset (px)
  y: number; // Vertical offset on the table plane (px)
}

interface ChipPile3D {
  stacks: ChipStack3D[];
}

const chipPiles: ChipPile3D[] = [
  {
    stacks: [
      { weight: 1, maxChips: 8, x: 10, y: -10 },
      { weight: 2, maxChips: 12, x: -20, y: 0 },
      { weight: 3, maxChips: 16, x: 15, y: 10 },
    ],
  },
];

const ChipPile = ({ count }: { count: number }) => {
  count = Math.floor(count);
  const chipPile = useRef<ChipPile3D>(
    chipPiles[Math.floor(Math.random() * chipPiles.length)]
  );
  const stacks: number[] = [];
  let remaining = count;

  chipPile.current.stacks.forEach((stack) => {
    const take = Math.min(stack.maxChips, remaining);
    stacks.push(take);
    remaining -= take;
  });

  // console.log(remaining);

  return (
    <Container height="full" position="relative" w="full">
      <AnimatePresence>
        {stacks.map((stack, index) => {
          const y = chipPile.current.stacks[index].y;
          const x = chipPile.current.stacks[index].x;
          const scale = Math.pow(PILE_Y_SCALE, y);
          return (
            <Box
              key={index}
              bottom={`calc(25% + ${y}px)`}
              left={`calc(50% + ${x}px)`}
              position="absolute"
              style={{ transform: `scale(${scale})` }}
              transformOrigin="center bottom"
              zIndex={-y}
            >
              <Stack count={stack} />
            </Box>
          );
        })}
      </AnimatePresence>
    </Container>
  );
};

const CHIP_HEIGHT = 20;
const CHIP_OVERLAP = 13;
const CHIP_MAX_X_OFFSET = 1;
const STAGGER = 0.05;
const DURATION = 0.2;

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

const Stack = ({ count }: { count: number }) => {
  const chipIdRef = useRef<number>(0);
  const [chips, setChips] = useState<{ id: number; xOffset: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) return;

    if (chips.length < count) {
      setIsAnimating(true);
      setChips((prev) => [
        ...prev,
        {
          id: chipIdRef.current++,
          xOffset: Math.round(
            Math.random() * (CHIP_MAX_X_OFFSET * 2) - CHIP_MAX_X_OFFSET
          ),
        },
      ]);
      setTimeout(() => setIsAnimating(false), STAGGER * 1000);
    } else if (chips.length > count) {
      setIsAnimating(true);
      setChips((prev) => prev.slice(0, -1));
      setTimeout(() => setIsAnimating(false), STAGGER * 1000);
    }
  }, [count, isAnimating, chips]);

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
        style={{ transform: `translateX(${xOffset}px)` }}
      />
    </MotionBox>
  );
};

export default ChipPile;

// Alternative solution to staggered chip animation: JIC the current system does not work out of the blue
/*
const CHIP_HEIGHT = 20;
const CHIP_OVERLAP = 13;
const STAGGER = 0.05;

const chipVariants = {
  hide: ([, exitIndex]: [number, number]) => ({
    opacity: 0,
    y: "-20px",
    transition: {
      delay: exitIndex * STAGGER,
      duration: 0.2,
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.5,
    },
  }),
  show: ([enterIndex]: [number, number]) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: enterIndex * STAGGER,
      duration: 0.2,
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.5,
    },
  }),
};

const Stack = ({ count }: { count: number }) => {
  const chipIdRef = useRef<number>(0);
  const [chips, setChips] = useState<{ id: number; offset: number }[]>(() =>
    Array.from({ length: count }, () => ({
      id: chipIdRef.current++,
      offset: 0,
    }))
  );
  const isRemoving = useRef(false);
  const pendingAdds = useRef(0);

  useEffect(() => {
    setChips((prev) => {
      if (prev.length < count && !isRemoving.current) {
        return [
          ...prev,
          ...Array.from({ length: count - prev.length }, () => ({
            id: chipIdRef.current++,
            offset: prev.length,
          })),
        ];
      } else if (prev.length < count && isRemoving.current) {
        pendingAdds.current = count - prev.length;
        return prev;
      } else if (prev.length > count) {
        isRemoving.current = true;
        return prev.slice(0, count);
      } else {
        return prev;
      }
    });
  }, [count]);

  const handleExitComplete = () => {
    if (pendingAdds.current > 0) {
      setChips((prev) => [
        ...prev,
        ...Array.from({ length: pendingAdds.current }, () => ({
          id: chipIdRef.current++,
          offset: prev.length,
        })),
      ]);
      pendingAdds.current = 0;
    }
    isRemoving.current = false;
  };

  return (
    <MotionVStack flexDirection="column-reverse" gap="0" position="relative">
      <AnimatePresence initial={true} onExitComplete={handleExitComplete}>
        {chips.map((chip, i, arr) => {
          const enterIndex = i - chip.offset;
          const exitIndex = arr.length - 1 - i;
          return (
            <Chip
              key={chip.id}
              enterIndex={enterIndex}
              exitIndex={exitIndex}
              absIndex={i}
            />
          );
        })}
      </AnimatePresence>
    </MotionVStack>
  );
};

const Chip = ({
  enterIndex,
  exitIndex,
  absIndex,
}: {
  enterIndex: number;
  exitIndex: number;
  absIndex: number;
}) => {
  return (
    <MotionBox
      animate="show"
      custom={[enterIndex, exitIndex]}
      exit="hide"
      height={`${CHIP_HEIGHT - CHIP_OVERLAP}px`}
      initial="hide"
      overflowY="visible"
      variants={chipVariants}
      zIndex={absIndex}
    >
      <Image draggable={false} height={`${CHIP_HEIGHT}px`} src={ChipImage} />
    </MotionBox>
  );
};

export default ChipPile;
*/
