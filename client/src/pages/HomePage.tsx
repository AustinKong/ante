import {
  Box,
  Image,
  Button,
  VStack,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import FiniteCarousel from "@/components/custom/FiniteCarousel";
import { useAuth } from "@/hooks/useAuth";

const CAROUSEL_CONTENTS = [
  {
    image: "/Slide1.png",
    title: "No poker chips? No problem.",
    description:
      "Track bets and chip stacks with your phone — no physical chips needed.",
  },
  {
    image: "/Slide1.png",
    title: "Play physically, track digitally.",
    description:
      "You handle the cards, we handle the chips — fair, fast, and fuss-free.",
  },
  {
    image: "/Slide1.png",
    title: "Host or join a game instantly.",
    description:
      "Just share a room code. Play anywhere, anytime — no setup required.",
  },
];

const HomePage = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  return (
    <VStack gap="4" h="100vh" p="4" w="full">
      <Box flex="1" w="full">
        <FiniteCarousel>
          {CAROUSEL_CONTENTS.map((content, index) => (
            <VStack key={index} alignItems="center" textAlign="center">
              <Image draggable="false" src={content.image} />
              <Heading fontWeight="bold" size="xl">
                {content.title}
              </Heading>
              <Text>{content.description}</Text>
            </VStack>
          ))}
        </FiniteCarousel>
      </Box>

      <VStack gap="2" w="full">
        <Button asChild size="lg" w="full">
          <RouterLink to="/joinRoom">Join a game</RouterLink>
        </Button>
        <Button
          size="lg"
          w="full"
          onClick={async () => {
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) navigate("/createRoom");
            else navigate("/login");
          }}
        >
          <RouterLink to="/createRoom">Host a game</RouterLink>
        </Button>
      </VStack>

      <Text color="fg.muted" fontSize="sm" lineHeight="1.2" textAlign="center">
        By pressing the buttons above, you agree to our
        <br />
        <Link asChild color="fg" variant="underline">
          <RouterLink to="/debug">Terms of Service</RouterLink>
        </Link>{" "}
        and{" "}
        <Link asChild color="fg" variant="underline">
          <RouterLink to="/debug">Privacy Policy</RouterLink>
        </Link>
        .
      </Text>
    </VStack>
  );
};

export default HomePage;
