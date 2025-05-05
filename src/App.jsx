// src/App.jsx
import React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion }       from "framer-motion"
import { useAuth }                       from "./context/AuthContext"
import Layout                            from "./components/Layout"
import HomePage                          from "./pages/HomePage"
import LoginPage                         from "./pages/LoginPage"
import RegisterPage                      from "./pages/RegisterPage"
import DashboardPage                     from "./pages/DashboardPage"
import NewPlanPage                       from "./pages/NewPlanPage"
import ViewPlanPage                      from "./pages/ViewPlanPage"
import EditPlanPage                      from "./pages/EditPlanPage"
import WorkoutCalendarPage               from "./pages/WorkoutCalendarPage"
import ProtectedRoute                    from "./ProtectedRoute"

// simple fade‐only variants (no y offset so header stays put)
const pageVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

export default function App() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return (
    // AnimatePresence with mode="wait" so ensure exit before enter
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>

          {/* PUBLIC PAGES */}
          <Route
            index
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                {isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : <HomePage />}
              </motion.div>
            }
          />
          <Route
            path="login"
            element={
              <motion.div {...{ variants:pageVariants, initial:"initial", animate:"enter", exit:"exit" }}>
                {isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : <LoginPage />}
              </motion.div>
            }
          />
          <Route
            path="register"
            element={
              <motion.div {...{ variants:pageVariants, initial:"initial", animate:"enter", exit:"exit" }}>
                {isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : <RegisterPage />}
              </motion.div>
            }
          />

          {/* PROTECTED PAGES */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <motion.div {...{ variants:pageVariants, initial:"initial", animate:"enter", exit:"exit" }}>
                  <DashboardPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="plans/new"
            element={
              <ProtectedRoute>
                <motion.div {...{ variants:pageVariants, initial:"initial", animate:"enter", exit:"exit" }}>
                  <NewPlanPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="plans/:planId"
            element={
              <ProtectedRoute>
                <motion.div {...{ variants:pageVariants, initial:"initial", animate:"enter", exit:"exit" }}>
                  <ViewPlanPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="plans/:planId/edit"
            element={
              <ProtectedRoute>
                <motion.div {...{ variants:pageVariants, initial:"initial", animate:"enter", exit:"exit" }}>
                  <EditPlanPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="calendar"
            element={
              <ProtectedRoute>
                <motion.div {...{ variants:pageVariants, initial:"initial", animate:"enter", exit:"exit" }}>
                  <WorkoutCalendarPage />
                </motion.div>
              </ProtectedRoute>
            }
          />

        </Route>
      </Routes>
    </AnimatePresence>
  )
}
