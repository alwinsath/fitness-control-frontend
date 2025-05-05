// src/components/ScheduleModal.jsx
import { useState } from "react"
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
  Text,
  Box,
} from "@chakra-ui/react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { scheduleWorkout } from "../services/workoutService"

export default function ScheduleModal({ isOpen, onClose, planId }) {
  const [selectedDates, setSelectedDates] = useState([])
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const toast = useToast()

  // toggle a date on/off
  const handleDayClick = (date) => {
    const key = date.toDateString()
    setSelectedDates((prev) =>
      prev.some((d) => d.toDateString() === key)
        ? prev.filter((d) => d.toDateString() !== key)
        : [...prev, date]
    )
  }

  const handleSubmit = async () => {
    if (selectedDates.length === 0) {
      toast({
        title: "Select at least one day.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setIsSubmitting(true)
    try {
      await Promise.all(
        selectedDates.map((date) => {
          const iso = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-")
          return scheduleWorkout(planId, iso)
        })
      )
      toast({
        title: "Workout scheduled!",
        description: `Booked ${selectedDates.length} day${
          selectedDates.length > 1 ? "s" : ""
        }.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onClose()
      setSelectedDates([])
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
    <Modal isOpen={isOpen} onClose={() => {
        onClose()
        setSelectedDates([])
      }} isCentered size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Workout Days</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3}>
            {selectedDates.length
              ? `Selected: ${selectedDates
                  .map((d) => d.toLocaleDateString())
                  .join(", ")}`
              : "Click on each calendar day to toggle it."}
          </Text>
          <Box
            p={4}
            bg="white"
            rounded="md"
            shadow="sm"
            sx={{
              ".react-calendar__tile--active.workout-day": {
                background: "#38A169 !important",
                color: "white !important",
                borderRadius: "50% !important",
              },
            }}
          >
            <Calendar
              onClickDay={handleDayClick}
              tileClassName={({ date, view }) =>
                view === "month" &&
                selectedDates.some(
                  (d) => d.toDateString() === date.toDateString()
                )
                  ? "workout-day"
                  : null
              }
            />
          </Box>
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
