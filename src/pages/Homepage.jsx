// src/pages/HomePage.jsx
import { Box, Heading, Text } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Heading color="teal.500">Hello, Chakra is working!</Heading>
      <Text mt={4}>You’re now on React 18 + Chakra 2.</Text>
    </Box>
  );
}
