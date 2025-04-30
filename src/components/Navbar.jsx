import { Link as RouterLink } from 'react-router-dom'
import { Flex, Box, Link, Button } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <Flex
      as="nav"
      bg="blue.600"
      color="white"
      align="center"
      justify="space-between"
      px={6}
      py={4}
    >
      <Box fontSize="xl" fontWeight="bold">
        <Link
          as={RouterLink}
          to={isAuthenticated ? '/dashboard' : '/'}
          _hover={{ textDecoration: 'none' }}
          color="white"
        >
          Fitness Control
        </Link>
      </Box>

      <Flex align="center">
        {!isAuthenticated ? (
          <>
            <Link as={RouterLink} to="/" mr={4}>
              Home
            </Link>
            <Link as={RouterLink} to="/login" mr={4}>
              Login
            </Link>
            <Link as={RouterLink} to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link as={RouterLink} to="/dashboard" mr={4}>
              Dashboard
            </Link>
            <Button size="sm" colorScheme="orange" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  )
}
