// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Form.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({
    username: "",
    email:    "",
    password: "",
    dob:      "",      
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // front-end validation
    if (!form.username || !form.email || !form.password || !form.dob) {
      setError("All fields are required.");
      return;
    }

    try {
      const result = await registerUser(form);
      setSuccess("Registration successful! Redirecting…");
      // delay then send to login
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="page-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Username
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </label>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
