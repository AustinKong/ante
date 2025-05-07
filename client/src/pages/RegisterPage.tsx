import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Center,
  VStack,
  Heading,
  Field,
  Input,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/useAuth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  return (
    <Center h="100vh">
      <VStack gap="2">
        <Heading size="lg">Register</Heading>
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
          w="100%"
          onClick={() => {
            register(email, password).then(() => {
              navigate("/");
            });
          }}
        >
          Register
        </Button>
        <Text color="fg.muted" fontSize="sm" textAlign="center">
          Already have an account?{" "}
          <Link asChild color="fg" variant="underline">
            <RouterLink to="/login">Login</RouterLink>
          </Link>
        </Text>
      </VStack>
    </Center>
  );
};

export default RegisterPage;
