import { Container, VStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const DebugPage = () => {
  return (
    <Container>
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
    </Container>
  );
};

export default DebugPage;
