// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Button,
  Spinner,
  useToast,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import PlanCard from "../components/PlanCard"
import {
  fetchUserWorkoutPlans,
  createWorkoutPlan,
} from "../services/workoutService"

// wrap Chakra’s SimpleGrid so we can apply framer variants
const MotionGrid = motion(SimpleGrid)

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function DashboardPage() {
  const [plans, setPlans]     = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({
    name: "", description: "", difficulty: "Beginner", muscleGroup: ""
  })
  const [success, setSuccess] = useState("")
  const toast                 = useToast()

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

  useEffect(() => {
    loadPlans()
  }, [])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSuccess("")
  }

  const handleQuickCreate = async e => {
    e.preventDefault()
    try {
      await createWorkoutPlan(form)
      setSuccess("Plan created!")
      setForm({ name: "", description: "", difficulty: "Beginner", muscleGroup: "" })
      loadPlans()
    } catch (err) {
      toast({ status: "error", description: err.message })
    }
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    )
  }

  return (
    <Flex direction="column" align="center" px={{ base: 4, md: 8 }} py={6}>
      <Heading size="2xl" mb={8} textAlign="center">
        Your Workout Plans
      </Heading>

      {/* swap order here: QuickCreate first, then New Plan */}
      <HStack
        spacing={6}
        mb={10}
        w="100%"
        maxW="4xl"
        align="start"
        justify="center"
      >
        {/* QUICK CREATE form box on the left */}
        <Box flex="1" bg="gray.50" p={6} rounded="md" shadow="sm">
          <VStack
            as="form"
            spacing={4}
            align="stretch"
            onSubmit={handleQuickCreate}
          >
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
            <Button type="submit" colorScheme="brand">
              Quick Create
            </Button>
            {success && (
              <Box color="green.500" fontWeight="medium" textAlign="center">
                {success}
              </Box>
            )}
          </VStack>
        </Box>

        {/* + NEW PLAN button on the right */}
        <Button
          as={RouterLink}
          to="/plans/new"
          colorScheme="brand"
          minW="140px"
        >
          + New Plan
        </Button>
      </HStack>

      <MotionGrid
        w="100%"
        maxW="8xl"
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={6}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {plans.map(plan => (
          <motion.div key={plan.id} variants={itemVariants}>
            <PlanCard
              plan={plan}
              onDeleted={() => {
                toast({ status: "success", description: "Plan deleted" })
                loadPlans()
              }}
            />
          </motion.div>
        ))}
      </MotionGrid>
    </Flex>
  )
}
