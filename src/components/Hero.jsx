// src/components/Hero.jsx
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react"

export default function Hero() {
  return (
    <Box
      w="100%"
      bgGradient="linear(to-r, brand.500, brand.600)"
      color="white"
      py={{ base: 12, md: 20 }}
      px={{ base: 6, md: 12 }}
      borderRadius="lg"
      textAlign="center"
      mb={12}
    >
      <Heading as="h1" size="2xl" mb={4}>
        Take Control of Your Fitness
      </Heading>
      <Text fontSize="lg" mb={6}>
        Plan your workouts, track progress, and stay motivated every day.
      </Text>
      <Button size="lg" colorScheme="orange" variant="solid">
        Get Started
      </Button>
    </Box>
  )
}
