// src/services/authService.js

const API_URL = "https://localhost:7145/api/Auth/";   // ← both register & login share this

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Registration failed");
  }
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}login`, {        // ← HTTPS + same base
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }
  return res.json();  // { token: "…" }
};
