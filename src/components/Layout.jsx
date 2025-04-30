// src/components/Layout.jsx
import { Outlet, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  Link,
} from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <>
      <Flex
        as="nav"
        bg="blue.600"
        color="white"
        px={6}
        py={4}
        align="center"
      >
        
        <Heading
          as={RouterLink}
          to={isAuthenticated ? '/dashboard' : '/'}
          size="md"
          cursor="pointer"
          color="white"
          _hover={{
            textDecoration: 'none',
            color: 'white',      
          }}
        >
          Fitness Control
        </Heading>

        <Spacer />

        {isAuthenticated ? (
          <>
            <Link
              as={RouterLink}
              to="/dashboard"
              mr={4}
              color="white"
              _hover={{
                textDecoration: 'underline',
                color: 'white',
              }}
            >
              Dashboard
            </Link>
            <Button
              onClick={logout}
              bg="white"
              color="orange.600"
              _hover={{ bg: 'gray.100' }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              as={RouterLink}
              to="/"
              mr={4}
              color="white"
              _hover={{
                textDecoration: 'underline',
                color: 'white',
              }}
            >
              Home
            </Link>
            <Link
              as={RouterLink}
              to="/login"
              mr={4}
              color="white"
              _hover={{
                textDecoration: 'underline',
                color: 'white',
              }}
            >
              Login
            </Link>
            <Link
              as={RouterLink}
              to="/register"
              color="white"
              _hover={{
                textDecoration: 'underline',
                color: 'white',
              }}
            >
              Register
            </Link>
          </>
        )}
      </Flex>

      <Box maxW="container.lg" mx="auto" py={6}>
        <Outlet />
      </Box>
    </>
  )
}
