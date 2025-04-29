import { Link as RouterLink } from "react-router-dom";
import { Center, Link, VStack } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Center h="100vh">
      <VStack gap="4">
        <Link asChild>
          <RouterLink to="/register">Register</RouterLink>
        </Link>
        <Link asChild>
          <RouterLink to="/login">Login</RouterLink>
        </Link>

        {localStorage.getItem("token") && (
          <Link asChild>
            <RouterLink to="/createRoom">Create Room</RouterLink>
          </Link>
        )}
        <Link asChild>
          <RouterLink to="/joinRoom">Join Game</RouterLink>
        </Link>
      </VStack>
    </Center>
  );
};

export default HomePage;
