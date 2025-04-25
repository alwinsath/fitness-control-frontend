// src/components/Layout.jsx
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-200 text-center py-4">
        © 2025 Fitness Control App
      </footer>
    </div>
  )
}
