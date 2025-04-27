// src/pages/NewPlanPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkoutPlan } from "../services/workoutService";

export default function NewPlanPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name:        "",
    description: "",
    difficulty:  "Beginner",
    muscleGroup: "",
    imageUrl:    "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic front-end validation
    if (!form.name || !form.difficulty) {
      setError("Name & difficulty are required.");
      return;
    }
    try {
      await createWorkoutPlan(form);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Workout Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}

        <label className="block">
          <span className="font-medium">Name *</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="font-medium">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="font-medium">Difficulty *</span>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>

        <label className="block">
          <span className="font-medium">Muscle Group</span>
          <input
            name="muscleGroup"
            value={form.muscleGroup}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Plan
        </button>
      </form>
    </div>
  );
}
