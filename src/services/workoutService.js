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


export async function fetchWorkoutPlan(planId) {
  const res = await fetch(`${API_BASE}/WorkoutPlans/${planId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Could not load plan");
  }
  return await res.json();
}


export async function updateWorkoutPlan(planId, updatedPlan) {
  const res = await fetch(`${API_BASE}/WorkoutPlans/${planId}`, {
    method:  "PUT",
    headers: getAuthHeaders(),
    body:    JSON.stringify(updatedPlan),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Update plan failed");
  }
  return await res.text();
}

export async function deleteWorkoutPlan(planId) {
  const res = await fetch(`${API_BASE}/WorkoutPlans/${planId}`, {
    method:  "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Delete failed");
  }
}


export async function fetchExercises(planId) {
  const res = await fetch(`${API_BASE}/WorkoutPlans/${planId}/Exercises`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Could not load exercises");
  }
  return await res.json();
}


export async function createExercise(planId, exercise) {
  const res = await fetch(`${API_BASE}/WorkoutPlans/${planId}/Exercises`, {
    method:  "POST",
    headers: getAuthHeaders(),
    body:    JSON.stringify(exercise),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Add exercise failed");
  }
  return await res.json();
}


export async function updateExercise(planId, id, exercise) {
  const res = await fetch(
    `${API_BASE}/WorkoutPlans/${planId}/Exercises/${id}`,
    {
      method:  "PUT",
      headers: getAuthHeaders(),
      body:    JSON.stringify(exercise),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Update exercise failed");
  }
  return await res.text();
}


export async function deleteExercise(planId, id) {
  const res = await fetch(
    `${API_BASE}/WorkoutPlans/${planId}/Exercises/${id}`,
    {
      method:  "DELETE",
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Delete exercise failed");
  }
}
