// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login }        = useAuth();
  const navigate         = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    // Clear any prior error as soon as they start typing again
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // clear previous error
    setError('');
    console.log('🔹 handleSubmit start →', form);

    try {
      console.log('🔹 calling loginUser(form)…');
      const { token } = await loginUser(form);
      console.log('🔹 loginUser returned token:', token);

      // persist token in context + storage
      login(token);
      console.log('🔹 login(token) ran');

      // redirect to dashboard
      navigate('/dashboard');
      console.log("🔹 navigate('/dashboard') ran");
    } catch (err) {
      console.error('🔸 error in handleSubmit:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '2rem auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          style={{ padding: '0.5rem 1rem', marginTop: 12 }}
        >
          Log In
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', fontWeight: 'bold', marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}
