import { useState, useEffect } from "react";
import {
  fetchUserWorkoutPlans,
  createWorkoutPlan,
} from "../services/workoutService";

export default function DashboardPage() {
  const [plans, setPlans]     = useState([]);
  const [form, setForm]       = useState({
    name: "",
    description: "",
    difficulty: "Beginner",
    muscleGroup: "",
    imageUrl: "",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // Load existing plans on mount
  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      const data = await fetchUserWorkoutPlans();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Form field change
  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  }

  // Submit new plan
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createWorkoutPlan(form);
      setSuccess("Workout plan created!");
      setForm({
        name: "",
        description: "",
        difficulty: "Beginner",
        muscleGroup: "",
        imageUrl: "",
      });
      loadPlans();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-container">
      <h1>Your Workout Plans</h1>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div>
          <label>Muscle Group</label>
          <input
            name="muscleGroup"
            value={form.muscleGroup}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Create Plan</button>
      </form>

      <h2>Existing Plans</h2>
      {plans.length === 0 ? (
        <p>You have no plans yet.</p>
      ) : (
        <ul>
          {plans.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> — {p.difficulty},{" "}
              {p.muscleGroup}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
