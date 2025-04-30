// src/pages/NewPlanPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Stack,
} from '@chakra-ui/react'
import { createWorkoutPlan } from '../services/workoutService'

export default function NewPlanPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    difficulty: 'Beginner',
    muscleGroup: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await createWorkoutPlan(form)
      setSuccess('Workout plan created!')
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={4}
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
        New Workout Plan
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              bg="gray.50"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              bg="gray.50"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Difficulty</FormLabel>
            <Select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Muscle Group</FormLabel>
            <Input
              name="muscleGroup"
              value={form.muscleGroup}
              onChange={handleChange}
              bg="gray.50"
            />
          </FormControl>

          {error && <Text color="red.500">{error}</Text>}
          {success && <Text color="green.500">{success}</Text>}

          <Button type="submit" colorScheme="orange">
            Create Plan
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
