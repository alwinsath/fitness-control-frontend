// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, FormControl, FormLabel, FormErrorMessage, Heading, Text } from "@chakra-ui/react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Both fields are required");
      return;
    }
    try {
      const { token } = await loginUser(form);
      login(token);
      nav("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} boxShadow="md" borderRadius="md" bg="white">
      <Heading mb={6}>Login</Heading>
      <form onSubmit={handleSubmit} noValidate>
        <FormControl id="username" isInvalid={!!error && !form.username} mb={4}>
          <FormLabel>Username</FormLabel>
          <Input name="username" value={form.username} onChange={handleChange} />
          {!form.username && <FormErrorMessage>Username is required</FormErrorMessage>}
        </FormControl>

        <FormControl id="password" isInvalid={!!error && !form.password} mb={4}>
          <FormLabel>Password</FormLabel>
          <Input name="password" type="password" value={form.password} onChange={handleChange} />
          {!form.password && <FormErrorMessage>Password is required</FormErrorMessage>}
        </FormControl>

        {error && (
          <Text color="red.500" fontWeight="bold" mb={4}>
            {error}
          </Text>
        )}

        <Button colorScheme="teal" type="submit" width="full">
          Log In
        </Button>
      </form>
    </Box>
  );
}
