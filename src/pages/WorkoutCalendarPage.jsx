// src/pages/WorkoutCalendarPage.jsx
import { useEffect, useState, useMemo } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import {
  Box,
  Heading,
  Spinner,
  useToast,
  Flex,
  Progress,
  Text,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react"
import TipBanner from "../components/TipBanner"
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

  // 1️⃣ Load & normalize scheduled dates
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWorkoutCalendar()
        setEntries(
          data.map((e) => {
            const dt = new Date(e.date)
            return {
              y: dt.getFullYear(),
              m: dt.getMonth(),
              d: dt.getDate(),
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
  }, [toast])

  // helper: is there a workout on this date?
  const hasWorkout = (date) =>
    entries.some(
      (e) =>
        e.y === date.getFullYear() &&
        e.m === date.getMonth() &&
        e.d === date.getDate()
    )

  // 2️⃣ When user clicks a day
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

  // 3️⃣ Compute summary metrics
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
  const workoutsThisWeek = useMemo(
    () =>
      entries.filter((e) => {
        const d = new Date(e.y, e.m, e.d)
        return d >= startOfWeek && d <= today
      }).length,
    [entries, startOfWeek, today]
  )

  const streak = useMemo(() => {
    let count = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      if (hasWorkout(d)) count++
      else break
    }
    return count
  }, [entries, today])

  const WEEKLY_GOAL = 5

  return (
    <Flex direction="column" align="center" py={10} px={4}>
      <TipBanner />

      <Heading mb={6}>My Workout Calendar</Heading>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Flex
          direction={{ base: "column", md: "row" }}
          align="flex-start"
          gap={8}
        >
          {/* Calendar + wrapper */}
          <Box className="calendar-wrapper">
            <Calendar
              onClickDay={handleDateClick}
              className="big-calendar"
              tileClassName={({ date, view }) => (
                view === "month" && hasWorkout(date)
                  ? "workout-day"
                  : null
              )}
            />
          </Box>

          {/* Sidebar Summary */}
          <Box
            w={{ base: "100%", md: "240px" }}
            p={4}
            bg="white"
            rounded="lg"
            shadow="lg"
          >
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  This Week
                </Text>
                <HStack justify="space-between">
                  <Text fontWeight="bold">{workoutsThisWeek}</Text>
                  <Text>/ {WEEKLY_GOAL}</Text>
                </HStack>
                <Progress
                  value={(workoutsThisWeek / WEEKLY_GOAL) * 100}
                  size="sm"
                  colorScheme="brand"
                  mt={2}
                />
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Streak
                </Text>
                <Text fontWeight="bold">{streak} days</Text>
              </Box>

              <Button size="sm" colorScheme="brand" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </VStack>
          </Box>
        </Flex>
      )}

      <WorkoutDetailsModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        isLoading={loadingDetails}
        workouts={selectedWorkouts}
        setWorkouts={setSelectedWorkouts}
        error={error}
      />
    </Flex>
  )
}
