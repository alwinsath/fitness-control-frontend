// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Box,
  Button,
  Badge,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import {
  fetchUserWorkoutPlans,
  createWorkoutPlan,
  deleteWorkoutPlan,
} from "../services/workoutService"

export default function DashboardPage() {
  const [plans, setPlans]                       = useState([])
  const [loading, setLoading]                   = useState(true)
  const [form, setForm]                         = useState({
    name:        "",
    description: "",
    difficulty:  "Beginner",
    muscleGroup: "",
  })
  const [success, setSuccess]                   = useState("")
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)
  const toast                                   = useToast()

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    setLoading(true)
    try {
      const data = await fetchUserWorkoutPlans()
      setPlans(data)
    } catch (err) {
      toast({ status: "error", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSuccess("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await createWorkoutPlan(form)
      setSuccess("Workout plan created!")
      setForm({
        name:        "",
        description: "",
        difficulty:  "Beginner",
        muscleGroup: "",
      })
      loadPlans()
    } catch (err) {
      toast({ status: "error", description: err.message })
    }
  }

  async function handleDelete(id) {
    try {
      await deleteWorkoutPlan(id)
      toast({ status: "success", description: "Plan deleted" })
      setConfirmingDeleteId(null)
      loadPlans()
    } catch (err) {
      toast({ status: "error", description: err.message })
    }
  }

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    )
  }

  return (
    <Box maxW="4xl" mx="auto" py={8} px={4}>
      {/* Header + New Plan button */}
      <HStack justify="space-between" mb={6}>
        <Heading>Your Workout Plans</Heading>
        <Button
          as={RouterLink}
          to="/plans/new"
          bg="teal.500"
          color="white"
          _hover={{ bg: "teal.500" }}     
          _active={{ bg: "teal.600" }}     
        >
          + New Plan
        </Button>
      </HStack>

      {}
      <Box as="form" onSubmit={handleSubmit} bg="gray.50" p={6} borderRadius="md" mb={8}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Leg Day"
              />
            </FormControl>
            <FormControl id="muscleGroup" isRequired>
              <FormLabel>Muscle Group</FormLabel>
              <Input
                name="muscleGroup"
                value={form.muscleGroup}
                onChange={handleChange}
                placeholder="e.g. Legs"
              />
            </FormControl>
            <FormControl id="difficulty">
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
          </HStack>

          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional notes…"
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" size="md">
            Create Plan
          </Button>
          {success && <Text color="green.500">{success}</Text>}
        </VStack>
      </Box>

      {}
      <VStack spacing={4} align="stretch">
        {plans.length === 0 && <Text>You have no plans yet.</Text>}

        {plans.map(plan => {
          const badgeColor =
            plan.difficulty === "Beginner"
              ? "green"
              : plan.difficulty === "Intermediate"
              ? "orange"
              : "red"

          return (
            <Box
              key={plan.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              bg="white"
            >
              <HStack justify="space-between">
                <Heading size="md">{plan.name}</Heading>
                <Badge colorScheme={badgeColor}>
                  {plan.difficulty}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600" mb={2}>
                {plan.muscleGroup}
              </Text>
              <Text mb={4}>{plan.description}</Text>

              <HStack spacing={3}>
                <Button size="sm" as={RouterLink} to={`/plans/${plan.id}`}>
                  View
                </Button>
                <Button
                  size="sm"
                  as={RouterLink}
                  to={`/plans/${plan.id}/edit`}
                  colorScheme="blue"
                >
                  Edit
                </Button>

                {confirmingDeleteId === plan.id ? (
                  <>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(plan.id)}
                    >
                      Confirm Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmingDeleteId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => setConfirmingDeleteId(plan.id)}
                  >
                    Delete
                  </Button>
                )}
              </HStack>
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
