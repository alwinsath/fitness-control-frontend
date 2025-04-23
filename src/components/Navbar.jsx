import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ background: '#eee', padding: '0.5rem' }}>
      <Link to="/"      style={{ marginRight: 10 }}>Home</Link>
      <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  )
}
