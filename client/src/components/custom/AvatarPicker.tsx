import { HStack, Avatar, IconButton, Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useState } from "react";

const MotionAvatar = motion.create(Avatar.Root);

const AvatarVariants = {
  initial: (direction: number) => ({ opacity: 0, x: direction > 0 ? 80 : -80 }),
  animate: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -80 : 80 }),
};

const AvatarPicker = ({
  avatars,
  onChange,
}: {
  avatars: string[];
  onChange: (index: number) => void;
}) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection(-1);
    const newIndex = (index - 1 + avatars.length) % avatars.length;
    onChange(newIndex);
    setIndex(newIndex);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setDirection(1);
    const newIndex = (index + 1) % avatars.length;
    onChange(newIndex);
    setIndex(newIndex);
  };

  return (
    <HStack>
      <IconButton variant="ghost" onClick={handlePrev}>
        <ChevronLeft />
      </IconButton>
      <Box overflow="hidden" position="relative">
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <MotionAvatar
            key={index}
            animate="animate"
            custom={direction}
            exit="exit"
            initial="initial"
            size="2xl"
            transition={{ duration: 0.2 }}
            variants={AvatarVariants}
            onAnimationComplete={() => setIsAnimating(false)}
            onAnimationStart={() => setIsAnimating(true)}
          >
            <Avatar.Fallback>bla</Avatar.Fallback>
            <Avatar.Image src={avatars[index]} />
          </MotionAvatar>
        </AnimatePresence>
      </Box>
      <IconButton variant="ghost" onClick={handleNext}>
        <ChevronRight />
      </IconButton>
    </HStack>
  );
};

export default AvatarPicker;
