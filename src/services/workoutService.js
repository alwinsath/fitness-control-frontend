// src/services/workoutService.js

const API_BASE = "https://localhost:7145/api";

// Grab the JWT from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type":  "application/json",
    Authorization:   `Bearer ${token}`,
  };
}

/**
 * Fetch the logged-in user’s workout plans.
 * GET /api/UserWorkoutPlans
 */
export async function fetchUserWorkoutPlans() {
  const res = await fetch(`${API_BASE}/UserWorkoutPlans`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Could not load workout plans");
  }
  return res.json(); // expect an array of plans
}
