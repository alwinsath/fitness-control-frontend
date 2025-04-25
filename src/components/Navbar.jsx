// src/components/Navbar.jsx
import { Box, Flex, Link as ChakraLink, Button, Spacer } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box bg="gray.100" px={6} py={3} shadow="md">
      <Flex maxW="1200px" mx="auto" align="center">
        <ChakraLink as={RouterLink} to="/" fontWeight="bold" fontSize="lg">
          Home
        </ChakraLink>

        <Spacer />

        {!isAuthenticated ? (
          <>
            <ChakraLink as={RouterLink} to="/login" mr={4}>
              Login
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/register">
              Register
            </ChakraLink>
          </>
        ) : (
          <Button variant="outline" colorScheme="teal" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Flex>
    </Box>
  );
}
