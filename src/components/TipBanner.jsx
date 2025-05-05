// src/components/TipBanner.jsx
import { useState, useEffect } from "react";
import { Box, Text, IconButton, Flex } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

const tips = [
  "💧 Stay hydrated! Drink water before and after your workout.",
  "🔥 Focus on form, not weight—quality reps matter most.",
  "⏱️ Schedule rest days to allow your muscles to recover.",
  "🥗 Pair workouts with balanced nutrition for best results.",
  "📈 Track your progress to stay motivated and on target."
];

export default function TipBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % tips.length);
    }, 5000); // swap every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <Flex
      align="center"
      bg="brand.200"
      color="brand.400"
      px={4}
      py={2}
      borderRadius="md"
      mb={4}
      mx="auto"
      maxW="600px"
      shadow="sm"
    >
      <InfoOutlineIcon mr={2} />
      <Text flex="1" fontSize="sm" fontWeight="medium">
        {tips[idx]}
      </Text>
      <IconButton
        aria-label="Next tip"
        icon={<InfoOutlineIcon />}
        size="sm"
        variant="ghost"
        onClick={() => setIdx((i) => (i + 1) % tips.length)}
      />
    </Flex>
  );
}
