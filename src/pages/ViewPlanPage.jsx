// src/pages/ViewPlanPage.jsx
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Input,
  Textarea,
  Spinner,
  useToast,
  Divider,
  useDisclosure,
} from "@chakra-ui/react"

import {
  fetchWorkoutPlan,
  fetchExercises,
  createExercise,
  updateExercise,
  deleteExercise,
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

  const emptyEx = { name: "", sets: "", reps: "", instructions: "" }
  const [newEx, setNewEx] = useState(emptyEx)

  const [editingId, setEditingId] = useState(null)
  const [editEx, setEditEx] = useState(emptyEx)

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
    <Box p={6}>
      {loadingPlan ? (
        <Spinner />
      ) : (
        <Box>
          <Heading>{plan.name}</Heading>
          <Text>{plan.description}</Text>
          <Text>Difficulty: {plan.difficulty}</Text>

          <Button colorScheme="blue" mt={4} onClick={onOpen}>
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
            <Box key={ex.id} p={4} borderWidth="1px" rounded="md">
              <Heading size="sm">{ex.name}</Heading>
              <Text>
                {ex.sets} sets x {ex.reps} reps
              </Text>
              <Text fontSize="sm" color="gray.500">
                {ex.instructions}
              </Text>
            </Box>
          ))}
        </Stack>
      )}

      <ScheduleModal isOpen={isOpen} onClose={onClose} planId={planId} />
    </Box>
  )
}
