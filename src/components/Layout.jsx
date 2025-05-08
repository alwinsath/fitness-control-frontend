// src/components/Layout.jsx
import { Outlet, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  Link,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { isAuthenticated, logout } = useAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('blue.600', 'brand.400')
  const text = useColorModeValue('white', 'gray.800')

  return (
    <>
      <Flex
        as="nav"
        bg={bg}
        color={text}
        px={6}
        py={4}
        align="center"
      >
        {/* Brand */}
        <Heading
          as={RouterLink}
          to={isAuthenticated ? '/dashboard' : '/'}
          size="md"
          cursor="pointer"
          color={text}
          _hover={{ textDecoration: 'none' }}
        >
          StayNFit
        </Heading>

        <Spacer />

        {/* Dark/Light toggle */}
        <IconButton
          aria-label="Toggle colour mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          mr={4}
          bg="transparent"
          color={text}
        />

        {isAuthenticated ? (
          <>
            <Link
              as={RouterLink}
              to="/dashboard"
              mr={4}
              _hover={{ textDecoration: 'underline' }}
            >
              Dashboard
            </Link>
            <Link
              as={RouterLink}
              to="/calendar"
              mr={4}
              _hover={{ textDecoration: 'underline' }}
            >
              Calendar
            </Link>
            <Button
              onClick={logout}
              bg="white"
              color="blue.600"
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
              _hover={{ textDecoration: 'underline' }}
            >
              Home
            </Link>
            <Link
              as={RouterLink}
              to="/login"
              mr={4}
              _hover={{ textDecoration: 'underline' }}
            >
              Login
            </Link>
            <Link
              as={RouterLink}
              to="/register"
              _hover={{ textDecoration: 'underline' }}
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
