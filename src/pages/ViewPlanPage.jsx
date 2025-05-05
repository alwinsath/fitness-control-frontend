// src/pages/ViewPlanPage.jsx
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Spinner,
  useToast,
  Divider,
  useDisclosure,
} from "@chakra-ui/react"

import {
  fetchWorkoutPlan,
  fetchExercises,
} from "../services/workoutService"

import ScheduleModal from "../components/ScheduleModal"

export default function ViewPlanPage() {
  const { planId } = useParams()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [plan, setPlan] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [exercises, setExercises] = useState([])
  const [loadingExercises, setLoadingExs] = useState(true)

  useEffect(() => {
    loadPlan()
    loadExercises()
  }, [planId])

  async function loadPlan() {
    setLoadingPlan(true)
    try {
      const p = await fetchWorkoutPlan(planId)
      setPlan(p)
    } catch (err) {
      toast({ status: "error", description: err.message })
    } finally {
      setLoadingPlan(false)
    }
  }

  async function loadExercises() {
    setLoadingExs(true)
    try {
      const list = await fetchExercises(planId)
      setExercises(list)
    } catch (err) {
      toast({ status: "error", description: err.message })
    } finally {
      setLoadingExs(false)
    }
  }

  return (
    <Box
      maxW="3xl"
      mx="auto"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
    >
      {loadingPlan ? (
        <Spinner />
      ) : (
        <Box mb={6}>
          <Heading mb={2}>{plan.name}</Heading>
          <Text mb={2}>{plan.description}</Text>
          <Text mb={4}>Difficulty: {plan.difficulty}</Text>

          
          <Button colorScheme="brand" onClick={onOpen}>
            Schedule This Plan
          </Button>

          <Divider my={6} />
        </Box>
      )}

      {loadingExercises ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          {exercises.map((ex) => (
            <Box
              key={ex.id}
              p={{ base: 4, md: 6 }}
              bg="white"
              rounded="md"
              shadow="sm"
            >
              <Heading size="sm" mb={1}>
                {ex.name}
              </Heading>
              <Text mb={1}>
                {ex.sets} sets × {ex.reps} reps
              </Text>
              <Text fontSize="sm" color="gray.500">
                {ex.instructions}
              </Text>
            </Box>
          ))}
        </Stack>
      )}

      <ScheduleModal
        isOpen={isOpen}
        onClose={onClose}
        planId={planId}
      />
    </Box>
  )
}
