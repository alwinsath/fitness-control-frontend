// src/components/PlanCard.jsx
import { useState } from "react"
import { Box, Heading, Badge, Text, HStack, Button, useToast } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { deleteWorkoutPlan } from "../services/workoutService"

export default function PlanCard({ plan, onDeleted }) {
  const toast = useToast()
  const [confirming, setConfirming] = useState(false)     // are we asking “confirm?”  
  const [loading, setLoading]       = useState(false)     // spinner state  

  const handleDeleteClick = () => {
    setConfirming(true)                                   // show “Confirm Delete”  
  }

  const handleCancel = () => {
    setConfirming(false)                                  // back to normal  
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await deleteWorkoutPlan(plan.id)                    // call API  
      toast({ status: "success", description: "Plan deleted" })
      onDeleted()                                         // tell parent  
    } catch (err) {
      toast({ status: "error", description: err.message })
      setConfirming(false)
    } finally {
      setLoading(false)
    }
  }

  const badgeColor =
    plan.difficulty === "Beginner"     ? "green" :
    plan.difficulty === "Intermediate" ? "orange" :
                                         "red"

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <HStack justify="space-between" mb={2}>
        <Heading size="md">{plan.name}</Heading>
        <Badge colorScheme={badgeColor}>{plan.difficulty.toUpperCase()}</Badge>
      </HStack>

      <Text fontSize="sm" color="gray.600" mb={4}>
        {plan.muscleGroup}
      </Text>

      <HStack spacing={3}>
        <Button size="sm" colorScheme="blue" as={RouterLink} to={`/plans/${plan.id}`}>
          View
        </Button>
        <Button size="sm" colorScheme="teal" as={RouterLink} to={`/plans/${plan.id}/edit`}>
          Edit
        </Button>

        {!confirming ? (
          // 1st click: offer to confirm
          <Button size="sm" colorScheme="red" onClick={handleDeleteClick}>
            Delete
          </Button>
        ) : (
          // 2nd step: Confirm + Cancel
          <>
            <Button
              size="sm"
              colorScheme="red"
              onClick={handleConfirm}
              isLoading={loading}
            >
              Confirm Delete
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        )}
      </HStack>
    </Box>
  )
}
