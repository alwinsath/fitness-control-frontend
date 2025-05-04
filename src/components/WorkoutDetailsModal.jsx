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
  } from "@chakra-ui/react";
  import { markWorkoutComplete } from "../services/workoutService";
  
  export default function WorkoutDetailsModal({
    isOpen,
    onClose,
    isLoading,
    workouts,
    error,
  }) {
    const toast = useToast();
  
    const handleMarkComplete = async (entryId) => {
      try {
        const updated = await markWorkoutComplete(entryId);
        toast({ title: "Marked complete!", status: "success" });
        // update local state so UI reflects the change
        // mutate workouts array in place:
        workouts.forEach((w, i) => {
          if (w.Id === updated.Id) workouts[i].Completed = true;
        });
      } catch (err) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
        });
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scheduled Workouts</ModalHeader>
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
                      <Text fontWeight="bold">{w.Plan.Name}</Text>
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
                          mt={2}
                          onClick={() => handleMarkComplete(w.Id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </ListItem>
                  </List>
                ) : null
              )
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  