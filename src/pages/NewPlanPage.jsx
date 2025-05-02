// src/pages/NewPlanPage.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  Checkbox,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Divider,
  useToast,
} from "@chakra-ui/react"

import { createWorkoutPlan, fetchSuggestions } from "../services/workoutService"

export default function NewPlanPage() {
  const navigate = useNavigate()
  const toast    = useToast()

  // plan form
  const [form, setForm] = useState({
    name:        "",
    description: "",
    difficulty:  "Beginner",
    muscleGroup: "",
  })

  // suggestions for the currently-selected group
  const [suggestions, setSuggestions] = useState([])

  // the full list of exercises the user has checked
  const [selectedExercises, setSelectedExercises] = useState([])

  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")

  // Fetch suggestions whenever the muscleGroup changes
  useEffect(() => {
    if (!form.muscleGroup) {
      setSuggestions([])
      return
    }

    fetchSuggestions(form.muscleGroup)
      .then(setSuggestions)
      .catch(err => {
        toast({ status: "error", description: err.message })
        setSuggestions([])
      })
  }, [form.muscleGroup, toast])

  // generic form field change
  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setError("")
    setSuccess("")
  }

  // toggle an exercise in/out of selectedExercises
  function toggleExercise(ex) {
    setSelectedExercises(prev => {
      const already = prev.find(e => e.name === ex.name)
      if (already) {
        return prev.filter(e => e.name !== ex.name)
      } else {
        return [...prev, ex]
      }
    })
  }

  // submit entire plan + selectedExercises to API
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError("Name is required.")
      return
    }
    if (!form.muscleGroup) {
      setError("Please pick at least one muscle group.")
      return
    }
    if (selectedExercises.length === 0) {
      setError("You must pick at least one exercise.")
      return
    }

    try {
      await createWorkoutPlan({
        ...form,
        exercises: selectedExercises
      })

      setSuccess("Workout plan created!")
      toast({ status: "success", description: "Plan created successfully" })
      setTimeout(() => navigate("/dashboard"), 800)

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box maxW="3xl" mx="auto" mt={8} p={6} bg="white" boxShadow="md" borderRadius="md">
      <Heading as="h2" size="xl" mb={4} textAlign="center" color="orange.400">
        New Workout Plan
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          {/* Plan info */}
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter plan name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
            />
          </FormControl>

          <HStack spacing={4} align="flex-start">
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
              <Select
                name="muscleGroup"
                value={form.muscleGroup}
                onChange={handleChange}
                placeholder="Select a group"
              >
                <option>Biceps</option>
                <option>Triceps</option>
                <option>Legs</option>
                <option>Back</option>
                <option>Chest</option>
                <option>Shoulders</option>
                <option>Core</option>
              </Select>
            </FormControl>
          </HStack>

          {/* Checkboxes for suggestions */}
          {suggestions.length > 0 && (
            <Box>
              <Text fontWeight="semibold" mb={2}>
                Pick Exercises from “{form.muscleGroup}”
              </Text>
              <VStack align="start">
                {suggestions.map(ex => (
                  <Checkbox
                    key={ex.name}
                    isChecked={selectedExercises.some(e => e.name === ex.name)}
                    onChange={() => toggleExercise(ex)}
                  >
                    {ex.name} — {ex.sets}×{ex.reps}
                  </Checkbox>
                ))}
              </VStack>
            </Box>
          )}

          <Divider />

          {/* Sidebar of already-chosen */}
          <Box>
            <Text fontWeight="semibold" mb={2}>
              Selected Exercises
            </Text>
            {selectedExercises.length === 0 ? (
              <Text color="gray.500">None yet.</Text>
            ) : (
              <HStack wrap="wrap" spacing={2}>
                {selectedExercises.map(ex => (
                  <Tag key={ex.name} size="md" variant="subtle" colorScheme="teal">
                    <TagLabel>
                      {ex.name} ({ex.sets}×{ex.reps})
                    </TagLabel>
                    <TagCloseButton onClick={() => toggleExercise(ex)} />
                  </Tag>
                ))}
              </HStack>
            )}
          </Box>

          {/* Errors & success */}
          {error && <Text color="red.500">{error}</Text>}
          {success && <Text color="green.500">{success}</Text>}

          {/* Submit */}
          <Button type="submit" colorScheme="orange" size="lg">
            Create Plan
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
