// src/pages/PlanDetailsPage.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Spacer,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  fetchWorkoutPlan,
  fetchExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  deleteWorkoutPlan,
} from "../services/workoutService"

export default function PlanDetailsPage() {
  const { planId } = useParams()
  const [plan, setPlan] = useState(null)
  const [exercises, setExercises] = useState([])
  const [form, setForm] = useState({
    name: "", sets: "", reps: "", instructions: ""
  })
  const [editingId, setEditingId] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    loadPlan(); loadExercises()
  }, [planId])

  async function loadPlan() {
    try {
      const data = await fetchWorkoutPlan(planId)
      setPlan(data)
    } catch (e) {
      toast({ status: "error", title: "Failed to load plan." })
    }
  }

  async function loadExercises() {
    try {
      const list = await fetchExercises(planId)
      setExercises(list)
    } catch (e) {
      toast({ status: "error", title: "Failed to load exercises." })
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editingId) {
        await updateExercise(planId, editingId, form)
        toast({ status: "success", title: "Exercise updated." })
      } else {
        await createExercise(planId, form)
        toast({ status: "success", title: "Exercise added." })
      }
      setForm({ name: "", sets: "", reps: "", instructions: "" })
      setEditingId(null)
      loadExercises()
    } catch (err) {
      toast({ status: "error", title: err.message })
    }
  }

  async function handleDeleteExercise(id) {
    if (!window.confirm("Delete this exercise?")) return
    try {
      await deleteExercise(planId, id)
      toast({ status: "info", title: "Exercise deleted." })
      loadExercises()
    } catch (err) {
      toast({ status: "error", title: err.message })
    }
  }

  async function handleDeletePlan() {
    if (!window.confirm("Delete this plan?")) return
    try {
      await deleteWorkoutPlan(planId)
      toast({ status: "info", title: "Plan deleted." })
      navigate("/dashboard")
    } catch (err) {
      toast({ status: "error", title: err.message })
    }
  }

  return (
    <Box
      maxW="3xl"
      mx="auto"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
      bg={useColorModeValue("brand.50", "gray.700")}
      rounded="lg"
      shadow="md"
    >
      <Flex mb={6} align="center">
        <Heading color="brand.700">{plan?.name}</Heading>
        <Spacer />
        <Button colorScheme="red" onClick={handleDeletePlan}>
          Delete Plan
        </Button>
      </Flex>

      <Text mb={6} color="brand.600">
        {plan?.description}
      </Text>

      {/* add/edit form */}
      <Box mb={8} bg="white" p={{ base: 4, md: 6 }} rounded="md" shadow="sm">
        <Heading size="md" mb={4} color="brand.700">
          {editingId ? "Edit Exercise" : "Add Exercise"}
        </Heading>
        <Stack spacing={3}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #CBD5E0",
            }}
          />
          <Flex gap={3}>
            <input
              name="sets"
              type="number"
              placeholder="Sets"
              value={form.sets}
              onChange={handleChange}
              style={{ flex: 1, padding: "0.5rem", borderRadius: 4 }}
            />
            <input
              name="reps"
              type="number"
              placeholder="Reps"
              value={form.reps}
              onChange={handleChange}
              style={{ flex: 1, padding: "0.5rem", borderRadius: 4 }}
            />
          </Flex>
          <textarea
            name="instructions"
            placeholder="Instructions"
            value={form.instructions}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              minHeight: 80,
              border: "1px solid #CBD5E0",
            }}
          />
          <Button colorScheme="brand" onClick={handleSubmit}>
            {editingId ? "Save" : "Add"}
          </Button>
        </Stack>
      </Box>

      {/* existing exercises */}
      <Stack spacing={4}>
        {exercises.length === 0 && <Text>No exercises yet.</Text>}
        {exercises.map(ex => (
          <Box
            key={ex.id}
            p={{ base: 4, md: 6 }}
            bg="brand.100"
            rounded="md"
            shadow="sm"
          >
            <Flex align="center" mb={2}>
              <Heading size="sm">{ex.name}</Heading>
              <Spacer />
              <Button size="sm" onClick={() => {
                setForm({ name: ex.name, sets: ex.sets, reps: ex.reps, instructions: ex.instructions })
                setEditingId(ex.id)
              }}>
                Edit
              </Button>
              <Button
                size="sm"
                ml={2}
                colorScheme="red"
                onClick={() => handleDeleteExercise(ex.id)}
              >
                Delete
              </Button>
            </Flex>
            <Text>
              {ex.sets} sets × {ex.reps} reps
            </Text>
            <Text mt={1}>{ex.instructions}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
