// src/services/authService.js

const API_URL = "https://localhost:7145/api/Auth/";

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(userData),
  });

  if (!res.ok) {
    // Try to read a custom message, otherwise fallback
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }

  // returns { message: "...", id: 123 }
  return await res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(credentials),
  });

  if (!res.ok) {
    // you can pull a message from the response here if you like:
    // const errText = await res.text();
    throw new Error("Login failed: invalid username or password");
  }

  const { token } = await res.json();
  return token;
};
