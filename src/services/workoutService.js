// src/services/workoutService.js

const API_BASE = "https://localhost:7145/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createWorkoutPlan(plan) {
  const res = await fetch(`${API_BASE}/WorkoutPlans`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(plan),
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
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedPlan),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Update plan failed");
  }
  return await res.text();
}

export async function deleteWorkoutPlan(planId) {
  const res = await fetch(`${API_BASE}/WorkoutPlans/${planId}`, {
    method: "DELETE",
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
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(exercise),
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
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(exercise),
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
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Delete exercise failed");
  }
}

export async function fetchSuggestions(muscleGroup) {
  const res = await fetch(`${API_BASE}/Suggestions/${muscleGroup}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Could not load suggestions");
  }
  return res.json();
}

// schedule a workout plan for a user
export async function scheduleWorkout(planId, date) {
  const res = await fetch(`${API_BASE}/WorkoutCalendar`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      planId,
      date,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to schedule workout");
  }

  return await res.json();
}

export async function fetchWorkoutCalendar() {
  const res = await fetch(`${API_BASE}/WorkoutCalendar`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch calendar")
  return await res.json()
}

export async function fetchWorkoutsByDate(date) {
  const res = await fetch(
    `${API_BASE}/WorkoutCalendar/by-date?date=${date}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to fetch workouts");
  }
  const data = await res.json();
  return data.map((w) => ({
    Id: w.id,
    Date: w.date,
    Completed: w.completed,
    Plan: {
      Id: w.plan.id,
      Name: w.plan.name,
      Difficulty: w.plan.difficulty,
      Exercises: w.plan.exercises.map((e) => ({
        Name: e.name,
        Sets: e.sets,
        Reps: e.reps,
        Instructions: e.instructions,
      })),
    },
  }));
}

// mark a scheduled workout complete
export async function markWorkoutComplete(id) {
  const res = await fetch(`${API_BASE}/WorkoutCalendar/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to mark complete");
  }
  return res.json(); 
}

// delete a scheduled workout
export async function deleteScheduledWorkout(id) {
  const res = await fetch(`${API_BASE}/WorkoutCalendar/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to delete scheduled workout");
  }
}



