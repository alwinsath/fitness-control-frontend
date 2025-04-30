// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from '@chakra-ui/react'
import { registerUser } from '../services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    dob: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password || !form.dob) {
      return setError('All fields are required.')
    }
    try {
      await registerUser(form)
      setSuccess('Registration successful! Redirecting…')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.message || 'Registration failed')
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
        Create Account
      </Heading>

      <form onSubmit={handleSubmit}>
        <FormControl id="username" mb={4} isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="Pick a username"
            value={form.username}
            onChange={handleChange}
            bg="gray.50"
          />
        </FormControl>

        <FormControl id="email" mb={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            bg="gray.50"
          />
        </FormControl>

        <FormControl id="password" mb={4} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            bg="gray.50"
          />
        </FormControl>

        <FormControl id="dob" mb={4} isRequired>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            bg="gray.50"
          />
        </FormControl>

        {error && (
          <Text color="red.500" mb={4} textAlign="center">
            {error}
          </Text>
        )}
        {success && (
          <Text color="green.500" mb={4} textAlign="center">
            {success}
          </Text>
        )}

        <Button type="submit" colorScheme="orange" width="full">
          Register
        </Button>
      </form>
    </Box>
  )
}
