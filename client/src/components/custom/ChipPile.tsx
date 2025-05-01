import { Box, Container, Image, VStack } from "@chakra-ui/react";
import ChipImage from "./Chip.png";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

/** A single pile of chips in 3D space */
interface ChipPile3D {
  id: string;
  chipCount: number;

  // **Position in 3D** (CSS translate3d)
  x: number; // horizontal offset (px)
  y: number; // vertical offset on the table plane (px)
  z: number; // depth toward the viewer (px, positive = closer)

  // **Scale is derived from z** so we see “perspective”
  scale: number;

  // **Priority/weight** for algorithms that decide which pile to add next
  weight: number;
}

/** Global configuration knobs */
interface PileFieldConfig {
  pileCount: number;

  // Ranges for our random‐or‐tweaked placement
  xRange: [number, number]; // e.g. [0, 300]
  yRange: [number, number]; // e.g. [0, 200]
  zRange: [number, number]; // e.g. [-200,   0]   (–200px “farther,” 0px “at eye‐level”)

  // How scale maps to z
  scaleRange: [number, number]; // e.g. [0.7, 1.2]  (far piles are small)

  // Base weight for each pile (will normalize to probabilities)
  baseWeight: number;
}

const ChipPile = ({ count }: { count: number }) => {
  count = Math.floor(count);

  // TODO: Look inot propogate prop of AnimatePresence
  return (
    <Container>
      <AnimatePresence>
        <Stack count={count} />
      </AnimatePresence>
    </Container>
  );
};

const CHIP_HEIGHT = 20;
const CHIP_OVERLAP = 13;
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
  const [chips, setChips] = useState<{ id: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) return;

    if (chips.length < count) {
      setIsAnimating(true);
      setChips((prev) => [...prev, { id: chipIdRef.current++ }]);
      setTimeout(() => setIsAnimating(false), STAGGER * 1000);
    } else if (chips.length > count) {
      setIsAnimating(true);
      setChips((prev) => prev.slice(0, -1));
      setTimeout(() => setIsAnimating(false), STAGGER * 1000);
    }
  }, [count, isAnimating, chips]);

  return (
    <MotionVStack flexDirection="column-reverse" gap="0" position="relative">
      <AnimatePresence initial={true}>
        {chips.map((chip, i) => {
          return <Chip key={chip.id} index={i} />;
        })}
      </AnimatePresence>
    </MotionVStack>
  );
};

const Chip = ({ index }: { index: number }) => {
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
      <Image draggable={false} height={`${CHIP_HEIGHT}px`} src={ChipImage} />
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
