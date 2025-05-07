import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Center,
  VStack,
  Heading,
  Field,
  Input,
  Button,
  Link,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <Center h="100vh">
      <VStack gap="2">
        <Heading size="lg">Sign in</Heading>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Field.HelperText>We'll never share your email</Field.HelperText>
        </Field.Root>
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <PasswordInput
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Field.HelperText>Must be at least 8 characters</Field.HelperText>
        </Field.Root>
        <Button
          w="full"
          onClick={() => {
            login(email, password).then(() => {
              navigate("/");
            });
          }}
        >
          Login
        </Button>

        <Text color="fg.muted" fontSize="sm" textAlign="center">
          Don't have an account?{" "}
          <Link asChild color="fg" variant="underline">
            <RouterLink to="/register">Register</RouterLink>
          </Link>
        </Text>
      </VStack>
    </Center>
  );
};

export default LoginPage;
