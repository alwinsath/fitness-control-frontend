// src/pages/PlanDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchWorkoutPlan,
  fetchExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  deleteWorkoutPlan,
} from "../services/workoutService";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Input,
  Textarea,
  Flex,
  Spacer,
  useToast,
} from "@chakra-ui/react";

export default function PlanDetailsPage() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sets: "",
    reps: "",
    instructions: "",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadPlan();
    loadExercises();
  }, [planId]);

  async function loadPlan() {
    try {
      const data = await fetchWorkoutPlan(planId);
      setPlan(data);
    } catch (e) {
      toast({ status: "error", title: "Failed to load plan." });
    }
  }

  async function loadExercises() {
    try {
      const list = await fetchExercises(planId);
      setExercises(list);
    } catch (e) {
      toast({ status: "error", title: "Failed to load exercises." });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExercise(planId, editingId, form);
        toast({ status: "success", title: "Exercise updated." });
      } else {
        await createExercise(planId, form);
        toast({ status: "success", title: "Exercise added." });
      }
      setForm({ name: "", sets: "", reps: "", instructions: "" });
      setEditingId(null);
      loadExercises();
    } catch (err) {
      toast({ status: "error", title: err.message });
    }
  }

  function startEdit(ex) {
    setForm({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      instructions: ex.instructions,
    });
    setEditingId(ex.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteExercise(id) {
    if (!window.confirm("Delete this exercise?")) return;
    try {
      await deleteExercise(planId, id);
      toast({ status: "info", title: "Exercise deleted." });
      loadExercises();
    } catch (err) {
      toast({ status: "error", title: err.message });
    }
  }

  async function handleDeletePlan() {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await deleteWorkoutPlan(planId);
      toast({ status: "info", title: "Plan deleted." });
      navigate("/dashboard");
    } catch (err) {
      toast({ status: "error", title: err.message });
    }
  }

  return (
    <Box p={6}>
      <Flex mb={6} align="center">
        <Heading>{plan?.name}</Heading>
        <Spacer />
        <Button colorScheme="red" onClick={handleDeletePlan}>
          Delete Plan
        </Button>
      </Flex>

      <Text mb={6}>{plan?.description}</Text>

      <Box mb={8} p={4} borderWidth="1px" borderRadius="md">
        <Heading size="md" mb={4}>
          {editingId ? "Edit Exercise" : "Add Exercise"}
        </Heading>
        <Stack spacing={3}>
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Flex gap={3}>
            <Input
              name="sets"
              placeholder="Sets"
              type="number"
              value={form.sets}
              onChange={handleChange}
            />
            <Input
              name="reps"
              placeholder="Reps"
              type="number"
              value={form.reps}
              onChange={handleChange}
            />
          </Flex>
          <Textarea
            name="instructions"
            placeholder="Instructions"
            value={form.instructions}
            onChange={handleChange}
          />
          <Button colorScheme="blue" onClick={handleSubmit}>
            {editingId ? "Save" : "Add"}
          </Button>
        </Stack>
      </Box>

      <Stack spacing={4}>
        {exercises.length === 0 && <Text>No exercises yet.</Text>}
        {exercises.map((ex) => (
          <Box key={ex.id} p={4} borderWidth="1px" borderRadius="md">
            <Flex align="center" mb={2}>
              <Heading size="sm">{ex.name}</Heading>
              <Spacer />
              <Button size="sm" onClick={() => startEdit(ex)}>
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
  );
}
