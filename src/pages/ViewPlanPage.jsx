// src/pages/ViewPlanPage.jsx
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Input,
  Textarea,
  Select,
  Spinner,
  useToast,
  Divider,
} from "@chakra-ui/react"

import {
  fetchWorkoutPlan,
  fetchExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../services/workoutService"

export default function ViewPlanPage() {
  const { planId } = useParams()
  const toast     = useToast()

  // plan details
  const [plan, setPlan]               = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(true)

  // exercises list
  const [exercises, setExercises]           = useState([])
  const [loadingExercises, setLoadingExs]   = useState(true)

  // quick-add form
  const emptyEx = { name: "", sets: "", reps: "", instructions: "" }
  const [newEx, setNewEx] = useState(emptyEx)

  // inline-edit
  const [editingId, setEditingId]           = useState(null)
  const [editEx, setEditEx]                 = useState(emptyEx)

  // ─── fetch data ─────────────────────────────────────────────────────────────
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

  // ─── Quick Add ───────────────────────────────────────────────────────────────
  function handleNewChange(e) {
    setNewEx((v) => ({ ...v, [e.target.name]: e.target.value }))
  }
  async function handleNewSubmit(e) {
    e.preventDefault()
    try {
      await createExercise(planId, newEx)
      setNewEx(emptyEx)
      loadExercises()
      toast({ status: "success", description: "Exercise added" })
    } catch (err) {
      toast({ status: "error", description: err.message })
    }
  }

  // ─── Inline Edit ─────────────────────────────────────────────────────────────
  function startEdit(ex) {
    setEditingId(ex.id)
    setEditEx({
      name:         ex.name,
      sets:         ex.sets,
      reps:         ex.reps,
      instructions: ex.instructions,
    })
  }
  function handleEditChange(e) {
    setEditEx((v) => ({ ...v, [e.target.name]: e.target.value }))
  }
  async function saveEdit(id) {
    try {
      await updateExercise(planId, id, editEx)
      setEditingId(null)
      loadExercises()
      toast({ status: "success", description: "Exercise updated" })
    } catch (err) {
      toast({ status: "error", description: err.message })
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────────────
  async function onDelete(id) {
    if (!window.confirm("Delete this exercise?")) return
    try {
      await deleteExercise(planId, id)
      loadExercises()
      toast({ status: "success", description: "Exercise removed" })
    } catch (err) {
      toast({ status: "error", description: err.message })
    }
  }

  if (loadingPlan) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    )
  }

  return (
    <Box maxW="3xl" mx="auto" py={8} px={4}>
      {/* ─── Plan Header ───────────────────────────────────────────────────── */}
      <Heading mb={2}>{plan.name}</Heading>
      <Text color="gray.600">
        {plan.difficulty} &bull; {plan.muscleGroup}
      </Text>
      <Text mt={2}>{plan.description}</Text>

      <Divider my={6} />

      {/* ─── Exercises List ────────────────────────────────────────────────── */}
      <Heading size="md" mb={4}>Exercises</Heading>

      {loadingExercises ? (
        <Spinner />
      ) : exercises.length === 0 ? (
        <Text>No exercises yet.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {exercises.map((ex) => (
            <Box
              key={ex.id}
              p={4}
              bg="gray.50"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
            >
              {editingId === ex.id ? (
                // ─── Edit Form ─────────────────────────────
                <Stack spacing={3}>
                  <Input
                    name="name"
                    value={editEx.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                  />
                  <HStack spacing={3}>
                    <Input
                      name="sets"
                      type="number"
                      value={editEx.sets}
                      onChange={handleEditChange}
                      placeholder="Sets"
                    />
                    <Input
                      name="reps"
                      type="number"
                      value={editEx.reps}
                      onChange={handleEditChange}
                      placeholder="Reps"
                    />
                  </HStack>
                  <Textarea
                    name="instructions"
                    value={editEx.instructions}
                    onChange={handleEditChange}
                    placeholder="Instructions"
                  />
                  <HStack spacing={2}>
                    <Button size="sm" colorScheme="blue" onClick={() => saveEdit(ex.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </HStack>
                </Stack>
              ) : (
                // ─── Display Mode ─────────────────────────
                <>
                  <Heading size="sm">{ex.name}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    {ex.sets} sets × {ex.reps} reps
                  </Text>
                  <Text mt={1}>{ex.instructions}</Text>
                  <HStack mt={3} spacing={2}>
                    <Button size="sm" onClick={() => startEdit(ex)}>
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => onDelete(ex.id)}>
                      Delete
                    </Button>
                  </HStack>
                </>
              )}
            </Box>
          ))}
        </VStack>
      )}

      <Divider my={6} />

      {/* ─── Quick Add Form ────────────────────────────────────────────────── */}
      <Box as="form" onSubmit={handleNewSubmit} p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
        <Heading size="md" mb={3}>Quick Add Exercise</Heading>
        <Stack spacing={3}>
          <Input
            name="name"
            value={newEx.name}
            onChange={handleNewChange}
            placeholder="Name"
            required
          />
          <HStack spacing={3}>
            <Input
              name="sets"
              type="number"
              value={newEx.sets}
              onChange={handleNewChange}
              placeholder="Sets"
              required
            />
            <Input
              name="reps"
              type="number"
              value={newEx.reps}
              onChange={handleNewChange}
              placeholder="Reps"
              required
            />
          </HStack>
          <Textarea
            name="instructions"
            value={newEx.instructions}
            onChange={handleNewChange}
            placeholder="Instructions"
          />
          <Button type="submit" colorScheme="teal">
            Add Exercise
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
