import { Box, Center, HStack, VStack, Circle } from "@chakra-ui/react";
import { motion, useMotionValue } from "motion/react";
import { animate } from "motion";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";

const MotionBox = motion.create(Box);

const FiniteCarousel = ({ children }: { children: ReactNode[] }) => {
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [slideWidth, setSlideWidth] = useState(0);

  const pages = children.length;

  useLayoutEffect(() => {
    const width = containerRef.current?.offsetWidth || 0;
    setSlideWidth(width);
    x.set(-page * width);
  }, [page]);

  const handleDragEnd = () => {
    const offsetX = x.get();
    const index = Math.round(-offsetX / slideWidth);
    const clampedIndex = Math.max(0, Math.min(pages - 1, index));

    setPage(clampedIndex);
    animate(x, -clampedIndex * slideWidth, { duration: 0.3 });
  };

  return (
    <VStack height="full" width="full">
      <Box ref={containerRef} flex="1" overflow="hidden">
        <MotionBox
          display="flex"
          drag="x"
          dragConstraints={{ left: -(pages - 1) * slideWidth, right: 0 }}
          dragElastic={0.2}
          h="full"
          style={{ x }}
          width={`${pages * 100}%`}
          onDragEnd={handleDragEnd}
        >
          {children.map((child, i) => (
            <Center key={i} w="full">
              {child}
            </Center>
          ))}
        </MotionBox>
      </Box>

      <HStack gap="2" justify="center">
        {children.map((_, i) => (
          <Circle
            key={i}
            bg={i === page ? "fg" : "fg.subtle"}
            h="2"
            transition="background 0.2s"
            w="2"
          />
        ))}
      </HStack>
    </VStack>
  );
};

export default FiniteCarousel;
