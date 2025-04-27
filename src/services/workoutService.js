// src/services/workoutService.js
const API_BASE = "https://localhost:7145/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type":  "application/json",
    Authorization:   `Bearer ${token}`,
  };
}

export async function createWorkoutPlan(plan) {
  const res = await fetch(`${API_BASE}/WorkoutPlans`, {
    method:  "POST",
    headers: getAuthHeaders(),
    body:    JSON.stringify(plan),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Create plan failed");
  }
  return await res.json();
}

export async function fetchUserWorkoutPlans() {
  const res = await fetch(`${API_BASE}/WorkoutPlans`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to fetch plans");
  }
  return await res.json();
}
