// src/pages/LoginPage.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Text,
} from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { loginUser } from "../services/authService"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]             = useState({ username: "", password: "" })
  const [showPassword, setShowPwd]  = useState(false)
  const [error, setError]           = useState("")

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      return setError("Both fields are required.")
    }
    try {
      const { token } = await loginUser(form)
      login(token)
      navigate("/dashboard")
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={12}
      p={6}
      bg="white"
      boxShadow="lg"
      borderRadius="md"
    >
      <Heading
        as="h2"
        size="lg"
        mb={6}
        textAlign="center"
        color="orange.400"
      >
        Log In
      </Heading>

      <form onSubmit={handleSubmit} noValidate>
        <FormControl id="username" mb={4} isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="Your username"
            value={form.username}
            onChange={handleChange}
            bg="gray.50"
            focusBorderColor="brand.100"
          />
        </FormControl>

        <FormControl id="password" mb={4} isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              bg="gray.50"
              focusBorderColor="brand.100"
            />
            <InputRightElement width="3rem">
              <Button
                h="1.75rem"
                size="sm"
                variant="ghost"
                onClick={() => setShowPwd(v => !v)}
              >
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {error && (
          <Text color="red.500" mb={4} textAlign="center">
            {error}
          </Text>
        )}

        <Button type="submit" colorScheme="orange" width="full">
          Log In
        </Button>
      </form>
    </Box>
  )
}
