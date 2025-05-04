// shows the user their scheduled workouts on a calendar
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

  // load scheduled workouts on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchWorkoutCalendar()
        setEntries(data)
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
    loadData()
  }, [])

  // mark calendar tiles with scheduled workouts
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return
    const iso = date.toISOString().split("T")[0]
    const hasWorkout = entries.some(e => e.date.startsWith(iso))
    return hasWorkout ? "workout-day" : null
  }

  // handle click on a day
  const handleDateClick = async (date) => {
    setSelectedDate(date)
    setSelectedWorkouts([])
    setLoadingDetails(true)
    setError("")

    try {
      const iso = date.toISOString().split("T")[0]
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
          tileClassName={tileClassName}
          onClickDay={handleDateClick}
        />
      )}
      <WorkoutDetailsModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        isLoading={loadingDetails}
        workouts={selectedWorkouts}
        error={error}
      />
      <style>{`
        .workout-day {
          background: #38A169;
          color: white;
          border-radius: 50%;
        }
      `}</style>
    </Box>
  )
}
