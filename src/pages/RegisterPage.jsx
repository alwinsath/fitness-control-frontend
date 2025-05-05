// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,          // container for input + button
  Input,
  InputRightElement,   // positions our eye button
  Button,
  Text,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { registerUser } from '../services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    dob: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // validation
    if (!form.username || !form.email || !form.password || !form.dob) {
      return setError('All fields are required.')
    }
    if (!form.email.includes('@')) {
      return setError(`Please include an '@' in the email address.`)
    }
    const age = new Date().getFullYear() - new Date(form.dob).getFullYear()
    if (age < 16 || age > 70) {
      return setError('You must be between 16 and 70 years old.')
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
      bg="brand.50"
      boxShadow="md"
      borderRadius="lg"
    >
      <Heading
        as="h2"
        size="lg"
        mb={6}
        textAlign="center"
        color="brand.600"
      >
        Create Account
      </Heading>

      <form onSubmit={handleSubmit} noValidate>
        <FormControl id="username" mb={4} isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="Pick a username"
            value={form.username}
            onChange={handleChange}
            bg="white"
            borderColor="brand.200"
            _focus={{ borderColor: 'brand.500' }}
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
            bg="white"
            borderColor="brand.200"
            _focus={{ borderColor: 'brand.500' }}
          />
        </FormControl>

        <FormControl id="password" mb={4} isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              bg="white"
              borderColor="brand.200"
              _focus={{ borderColor: 'brand.500' }}
            />
            <InputRightElement>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="dob" mb={4} isRequired>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            bg="white"
            borderColor="brand.200"
            _focus={{ borderColor: 'brand.500' }}
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

        <Button
          type="submit"
          bg="brand.500"
          color="white"
          width="full"
          _hover={{ bg: 'brand.600' }}
        >
          Register
        </Button>
      </form>
    </Box>
  )
}
