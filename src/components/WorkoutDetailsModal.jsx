import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    List,
    ListItem,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    Badge,
    useToast,
  } from "@chakra-ui/react"
  import {
    markWorkoutComplete,
    deleteScheduledWorkout,
  } from "../services/workoutService"
  
  export default function WorkoutDetailsModal({
    isOpen,
    onClose,
    isLoading,
    workouts,
    setWorkouts,
    error,
  }) {
    const toast = useToast()
  
    // handler for marking complete
    const handleMarkComplete = async (id) => {
      try {
        const updated = await markWorkoutComplete(id)
        toast({ title: "Marked complete!", status: "success" })
        workouts.forEach((w, i) => {
          if (w.Id === updated.Id) workouts[i].Completed = true
        })
        setWorkouts([...workouts])
      } catch (err) {
        toast({ title: "Error", description: err.message, status: "error" })
      }
    }
  
    // handler for deleting entry
    const handleDelete = async (id) => {
      try {
        await deleteScheduledWorkout(id)
        toast({ title: "Deleted workout", status: "info" })
        setWorkouts(workouts.filter((w) => w.Id !== id))
      } catch (err) {
        toast({ title: "Error", description: err.message, status: "error" })
      }
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scheduled Workouts</ModalHeader> {/* modal title */}
          <ModalCloseButton />
          <ModalBody pb={6}>
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            ) : workouts.length === 0 ? (
              <Text>No workouts for this day</Text>
            ) : (
              workouts.map((w) =>
                w.Plan ? (
                  <List spacing={3} key={w.Id} mb={4}>
                    <ListItem>
                      <Text fontWeight="bold">{w.Plan.Name}</Text> {/* plan name */}
                      <Text fontSize="sm" color="gray.600">
                        Difficulty: {w.Plan.Difficulty}
                      </Text>
                    </ListItem>
                    {w.Plan.Exercises.map((ex, i) => (
                      <ListItem key={i} pl={4}>
                        • {ex.Name}: {ex.Sets}×{ex.Reps} — {ex.Instructions}
                      </ListItem>
                    ))}
                    <ListItem>
                      {w.Completed ? (
                        <Badge colorScheme="green">Completed</Badge>
                      ) : (
                        <Button
                          size="sm"
                          mr={2}
                          onClick={() => handleMarkComplete(w.Id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(w.Id)}
                      >
                        Delete
                      </Button>
                    </ListItem>
                  </List>
                ) : null
              )
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }
  