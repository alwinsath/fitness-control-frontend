// src/components/ScheduleModal.jsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useToast,
  } from "@chakra-ui/react"
  import { useState } from "react"
  import DatePicker from "react-datepicker"
  import "react-datepicker/dist/react-datepicker.css"
  import { scheduleWorkout } from "../services/workoutService" 
  
  export default function ScheduleModal({ isOpen, onClose, planId }) {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const toast = useToast()
  
    const handleSubmit = async () => {
      try {
        setIsSubmitting(true)
        await scheduleWorkout(planId, selectedDate) 
        toast({
          title: "Workout scheduled!",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        onClose()
      } catch (err) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              inline
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
  