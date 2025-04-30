// src/pages/EditPlanPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Text,
  HStack,
} from '@chakra-ui/react'
import { fetchWorkoutPlan, updateWorkoutPlan } from '../services/workoutService'

export default function EditPlanPage() {
  const { planId } = useParams()
  const navigate    = useNavigate()

  const [form, setForm]       = useState({
    name:         '',
    description:  '',
    difficulty:   'Beginner',
    muscleGroup:  '',
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  // load existing plan
  useEffect(() => {
    ;(async () => {
      try {
        const plan = await fetchWorkoutPlan(planId)
        setForm({
          name:         plan.name,
          description:  plan.description || '',
          difficulty:   plan.difficulty,
          muscleGroup:  plan.muscleGroup,
        })
      } catch (err) {
        setError(err.message)
      }
    })()
  }, [planId])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await updateWorkoutPlan(planId, form)
      setSuccess('Workout plan updated!')
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box maxW="lg" mx="auto" py={8} px={4}>
      <Heading mb={6} size="lg">Edit Workout Plan</Heading>

      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}
      {success && (
        <Text color="green.500" mb={4}>
          {success}
        </Text>
      )}

      <VStack
        as="form"
        spacing={4}
        align="stretch"
        onSubmit={handleSubmit}
      >
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Plan name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description"
          />
        </FormControl>

        <FormControl isRequired>
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
            placeholder="e.g. Legs, Back, Chest"
          />
        </FormControl>

        <HStack spacing={4} pt={4}>
          <Button colorScheme="teal" type="submit">
            Save
          </Button>
          <Button
            as={RouterLink}
            to="/dashboard"
            variant="outline"
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
