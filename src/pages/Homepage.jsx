// src/pages/HomePage.jsx
import { useState } from "react"
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Avatar,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import {
  CheckCircleIcon,
  TimeIcon,
  AtSignIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons"
import { motion } from "framer-motion"
import TipBanner from "../components/TipBanner"

// animated grid helper
const MotionGrid = motion(SimpleGrid)
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }

// feature cards data
const features = [
  {
    icon: CheckCircleIcon,
    title: "Custom Plans",
    text:  "Build workouts tailored to your goals, experience, and schedule.",
  },
  {
    icon: TimeIcon,
    title: "Easy Scheduling",
    text:  "Drag & drop workouts onto your calendar in seconds.",
  },
  {
    icon: AtSignIcon,
    title: "Stay Connected",
    text:  "Invite friends, share progress, and keep each other accountable.",
  },
]

// testimonial carousel data
const testimonials = [
  {
    quote:  "This app transformed my routine—I'm stronger than ever!",
    name:   "Mia T.",
    avatar: "/avatars/mia.jpg",
  },
  {
    quote:  "I love how easy it is to schedule sessions around my busy life.",
    name:   "Carlos R.",
    avatar: "/avatars/carlos.jpg",
  },
  {
    quote:  "The weekly reminders keep me on track 100% of the time!",
    name:   "Aisha K.",
    avatar: "/avatars/aisha.jpg",
  },
]

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0)
  const { quote, name, avatar } = testimonials[idx]
  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIdx(i => (i + 1) % testimonials.length)

  return (
    <Box textAlign="center" py={12} px={6} mb={16}>
      <Text fontStyle="italic" fontSize={{ base: "lg", md: "xl" }} mb={4}>
        “{quote}”
      </Text>
      <HStack justify="center" spacing={4} mb={6}>
        <Avatar src={avatar} name={name} />
        <Text fontWeight="bold">{name}</Text>
      </HStack>
      <HStack justify="center" spacing={4}>
        <IconButton icon={<ChevronLeftIcon />} onClick={prev} aria-label="Previous testimonial" />
        <IconButton icon={<ChevronRightIcon />} onClick={next} aria-label="Next testimonial" />
      </HStack>
    </Box>
  )
}

export default function HomePage() {
  const cols = useBreakpointValue({ base: 1, md: 2, lg: 3 })

  return (
    <>
      {/* 1. TipBanner */}
      <TipBanner message="💡 Pro tip: Set weekly reminders to never miss a session!" />

      {/* 2. Hero */}
      <Box
        bgGradient="linear(to-r, blue.400, blue.600)"
        color="white"
        py={{ base: 16, md: 24 }}
        px={6}
        textAlign="center"
        borderRadius="md"
        mb={16}
      >
        <Heading as="h1" size="3xl" mb={4}>
          Take Control of Your Fitness
        </Heading>
        <Text fontSize={{ base: "lg", md: "xl" }} mb={8} maxW="3xl" mx="auto">
          Plan your workouts, track progress, and stay motivated every day with our
          all-in-one fitness solution.
        </Text>
        <Button as={RouterLink} to="/register" colorScheme="orange" size="lg" px={8}>
          Get Started
        </Button>
      </Box>

      {/* 3. Features Grid */}
      <Box px={6} mb={16}>
        <MotionGrid
          columns={cols}
          spacing={10}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {features.map(f => (
            <motion.div key={f.title} variants={item}>
              <VStack align="start" spacing={4} p={6} bg="white" rounded="lg" shadow="md">
                <HStack
                  w={12}
                  h={12}
                  align="center"
                  justify="center"
                  bg="brand.100"
                  color="white"
                  rounded="full"
                >
                  <Icon as={f.icon} w={6} h={6} />
                </HStack>
                <Heading size="md">{f.title}</Heading>
                <Text color="gray.600">{f.text}</Text>
              </VStack>
            </motion.div>
          ))}
        </MotionGrid>
      </Box>

      {/* 4. Testimonials */}
      <TestimonialsCarousel />

      {/* 5. Final CTA */}
      <Box textAlign="center" py={16} px={6} bg="gray.50">
        <Heading as="h2" size="xl" mb={4}>
          Ready to Crush Your Goals?
        </Heading>
        <Text fontSize="lg" mb={8} maxW="2xl" mx="auto" color="gray.600">
          Join thousands of fitness enthusiasts who are taking control of their training
          with Fitness Control.
        </Text>
        <Button as={RouterLink} to="/register" colorScheme="brand" size="lg" px={8}>
          Create Your Free Account
        </Button>
      </Box>
    </>
  )
}
