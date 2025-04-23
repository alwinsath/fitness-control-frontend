import { Routes, Route } from 'react-router-dom'

import Layout         from './components/Layout'
import HomePage       from './pages/HomePage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import DashboardPage  from './pages/DashboardPage'
import ProtectedRoute from './ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Everything under "/" uses our Layout (navbar, etc.) */}
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index               element={<HomePage />} />
        <Route path="login"        element={<LoginPage />} />
        <Route path="register"     element={<RegisterPage />} />

        {/* Protected */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
