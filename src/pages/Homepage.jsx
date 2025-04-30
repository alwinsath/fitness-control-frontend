// src/pages/HomePage.jsx
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function HomePage() {
  return (
    <Box textAlign="center" py={20} px={6}>
      <Heading as="h1" size="2xl" mb={4} color="orange.400">
        Welcome to Fitness Control
      </Heading>
      <Text fontSize="lg" mb={8} color="gray.600">
        Build &amp; track your personalized workouts • Stay motivated • Smash your goals
      </Text>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify="center"
      >
        <Button
          as={RouterLink}
          to="/login"
          colorScheme="orange"
          size="lg"
          _hover={{ bg: 'orange.500' }}
        >
          Log In
        </Button>
        <Button
          as={RouterLink}
          to="/register"
          variant="outline"
          colorScheme="orange"
          size="lg"
        >
          Register
        </Button>
      </Stack>
    </Box>
  )
}
