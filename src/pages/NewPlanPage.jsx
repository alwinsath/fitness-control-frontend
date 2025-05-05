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
  SimpleGrid,
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

  // form state
  const [form, setForm] = useState({
    name:        "",
    description: "",
    difficulty:  "Beginner",
    muscleGroup: "",
  })

  // suggestions & selections
  const [suggestions, setSuggestions]         = useState([])
  const [selectedExercises, setSelectedExercises] = useState([])

  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")

  // fetch suggestions when muscleGroup changes
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

  // handle form field changes
  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setError(""); setSuccess("")
  }

  // toggle card selection
  function toggleExercise(ex) {
    setSelectedExercises(prev => {
      const already = prev.find(e => e.name === ex.name)
      if (already) {
        return prev.filter(e => e.name !== ex.name)
      }
      return [...prev, ex]
    })
  }

  // submit plan
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError("Name is required."); return
    }
    if (!form.muscleGroup) {
      setError("Please pick at least one muscle group."); return
    }
    if (selectedExercises.length === 0) {
      setError("You must pick at least one exercise."); return
    }

    try {
      await createWorkoutPlan({ ...form, exercises: selectedExercises })
      setSuccess("Workout plan created!")
      toast({ status: "success", description: "Plan created successfully" })
      setTimeout(() => navigate("/dashboard"), 800)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box
      maxW="3xl"
      mx="auto"
      mt={{ base: 6, md: 8 }}
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
      bg="white"
      boxShadow="md"
      borderRadius="md"
    >
      <Heading
        as="h2"
        size="xl"
        mb={4}
        textAlign="center"
        color="brand.300"
      >
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
              bg="gray.50"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              bg="gray.50"
            />
          </FormControl>

          <HStack spacing={4} align="flex-start">
            <FormControl>
              <FormLabel>Difficulty</FormLabel>
              <Select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                bg="gray.50"
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
                bg="gray.50"
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

          {/* Exercise suggestion cards */}
          {suggestions.length > 0 && (
            <Box>
              <Text fontWeight="semibold" mb={2}>
                Pick Exercises from “{form.muscleGroup}”
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                {suggestions.map(ex => {
                  const isSelected = selectedExercises.some(e => e.name === ex.name)
                  return (
                    <Box
                      key={ex.name}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      shadow={isSelected ? "md" : "sm"}
                      bg={isSelected ? "brand.100" : "white"}
                      cursor="pointer"
                      _hover={{
                        shadow: "md",
                        bg: isSelected ? "brand.200" : "gray.50",
                      }}
                      onClick={() => toggleExercise(ex)}
                    >
                      <Text fontWeight="bold" mb={1}>{ex.name}</Text>
                      <Text fontSize="sm">{ex.sets} sets × {ex.reps} reps</Text>
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        {ex.instructions}
                      </Text>
                    </Box>
                  )
                })}
              </SimpleGrid>
            </Box>
          )}

          <Divider />

          {/* Selected exercises */}
          <Box>
            <Text fontWeight="semibold" mb={2}>
              Selected Exercises
            </Text>
            {selectedExercises.length === 0 ? (
              <Text color="gray.500">None yet.</Text>
            ) : (
              <HStack wrap="wrap" spacing={2}>
                {selectedExercises.map(ex => (
                  <Tag key={ex.name} size="md" variant="subtle" colorScheme="brand">
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
          {error  && <Text color="red.500">{error}</Text>}
          {success && <Text color="green.500">{success}</Text>}

          {/* Submit */}
          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            width="full"
          >
            Create Plan
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
