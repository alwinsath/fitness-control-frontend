import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import NewPlanPage from "./pages/NewPlanPage"
import ViewPlanPage from "./pages/ViewPlanPage"
import EditPlanPage from "./pages/EditPlanPage"
import WorkoutCalendarPage from "./pages/WorkoutCalendarPage" // 🆕 added this!
import ProtectedRoute from "./ProtectedRoute"

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route
          index
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <HomePage />
          }
        />
        <Route
          path="login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage />
          }
        />
        <Route
          path="register"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <RegisterPage />
          }
        />

        {/* Protected */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plans/new"
          element={
            <ProtectedRoute>
              <NewPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plans/:planId"
          element={
            <ProtectedRoute>
              <ViewPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plans/:planId/edit"
          element={
            <ProtectedRoute>
              <EditPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="calendar"
          element={
            <ProtectedRoute>
              <WorkoutCalendarPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
