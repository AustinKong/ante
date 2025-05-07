import { Box, Center, HStack, VStack, Circle } from "@chakra-ui/react";
import { motion, useMotionValue } from "motion/react";
import { animate } from "motion";
import { ReactNode, useState } from "react";
import useMeasure from "@/hooks/useMeasure";

const SWIPE_VELOCITY_THRESHOLD = 1.5; // Velocity to exceed to trigger a swipe
const SWIPE_DISTANCE_THRESHOLD = 80; // Distance to exceed to trigger a swipe

const MotionBox = motion.create(Box);

const FiniteCarousel = ({
  children: initialChildren,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const children = Array.isArray(initialChildren)
    ? initialChildren
    : [initialChildren];

  const [page, setPage] = useState(0);
  const x = useMotionValue(0);
  const [ref, { width }] = useMeasure();

  const pages = children.length;
  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    let index = page;

    if (
      Math.abs(offsetX) > SWIPE_DISTANCE_THRESHOLD ||
      Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD
    ) {
      if (offsetX < 0) {
        index = Math.min(page + 1, pages - 1);
      } else {
        index = Math.max(page - 1, 0);
      }
    }

    setPage(index);
    animate(x, -index * width, { duration: 0.3 });
  };

  return (
    <VStack height="full" width="full">
      <Box ref={ref} flex="1" overflow="hidden" width="full">
        <MotionBox
          display="flex"
          drag="x"
          dragConstraints={{ left: -(pages - 1) * width, right: 0 }}
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
            aria-label={`Page ${i + 1} of ${pages}`}
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
