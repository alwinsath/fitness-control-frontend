// src/pages/WorkoutCalendarPage.jsx
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import {
  Box,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import {
  fetchWorkoutCalendar,
  fetchWorkoutsByDate,
} from "../services/workoutService"
import WorkoutDetailsModal from "../components/WorkoutDetailsModal"

export default function WorkoutCalendarPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedWorkouts, setSelectedWorkouts] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [error, setError] = useState("")
  const toast = useToast()

  // load and normalize scheduled dates via real Date parsing
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWorkoutCalendar()
        setEntries(
          data.map((e) => {
            const dt = new Date(e.date)   // parse ISO timestamp
            return {
              y: dt.getFullYear(),        // e.g. 2025
              m: dt.getMonth(),           // 0-based month
              d: dt.getDate(),            // 1–31 day
            }
          })
        )
      } catch (err) {
        toast({
          title: "Failed to load calendar",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // check if a given tile date has a workout
  const hasWorkout = (date) =>
    entries.some(
      (e) =>
        e.y === date.getFullYear() &&
        e.m === date.getMonth() &&
        e.d === date.getDate()
    )

  // fetch details when a tile is clicked
  const handleDateClick = async (date) => {
    setSelectedDate(date)
    setLoadingDetails(true)
    setError("")

    try {
      const iso = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-")
      const data = await fetchWorkoutsByDate(iso)
      setSelectedWorkouts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingDetails(false)
    }
  }

  return (
    <Box maxW="600px" mx="auto" mt={10}>
      <Heading mb={6}>My Workout Calendar</Heading>

      {loading ? (
        <Spinner />
      ) : (
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={({ date, view }) =>
            view === "month" && hasWorkout(date) ? "workout-day" : null
          }
        />
      )}

      <WorkoutDetailsModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        isLoading={loadingDetails}
        workouts={selectedWorkouts}
        setWorkouts={setSelectedWorkouts}
        error={error}
      />
    </Box>
  )
}
