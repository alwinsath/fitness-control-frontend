// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { fetchUserWorkoutPlans } from '../services/workoutService';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchUserWorkoutPlans();
        setPlans(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Your Workout Plans</h1>

        {error && (
          <p className="text-red-600 font-medium mb-4">{error}</p>
        )}

        {plans.length === 0 ? (
          <p className="text-gray-700">
            You have no plans yet.{' '}
            <Link to="/plans/new" className="text-blue-600 hover:underline">
              Create one
            </Link>.
          </p>
        ) : (
          <ul className="space-y-3">
            {plans.map(p => (
              <li key={p.id} className="border-b pb-2">
                <strong className="text-gray-800">{p.name}</strong>{' '}
                <span className="text-gray-600">
                  — {p.description || 'No description'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
