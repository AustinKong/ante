import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Center,
  VStack,
  Heading,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      localStorage.setItem("token", accessToken);
      navigate("/");
    }
  };

  return (
    <Center h="100vh">
      <VStack gap="2">
        <Heading size="lg">Register</Heading>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
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
        <Button w="100%" onClick={handleSubmit}>
          Register
        </Button>
      </VStack>
    </Center>
  );
};

export default RegisterPage;
