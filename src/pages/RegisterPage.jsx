// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function RegisterPage() {
  const [form, setForm]     = useState({ username: '', email: '', password: '', dob: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const navigate            = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // simple front–end check
    if (!form.username || !form.email || !form.password || !form.dob) {
      setError('All fields are required.');
      return;
    }

    try {
      await registerUser(form);
      setSuccess('Registration successful! Redirecting…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Register</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/** Username */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/** Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/** Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/** DOB */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
        {success && <p className="mt-4 text-green-600 font-medium">{success}</p>}
      </div>
    </div>
  );
}
