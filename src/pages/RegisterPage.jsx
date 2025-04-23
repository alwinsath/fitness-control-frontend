import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate age based on Date of Birth
    const dob = new Date(formData.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    
    // Adjust age calculation if birthday hasn't occurred yet this year
    if (new Date().getMonth() < dob.getMonth() || 
        (new Date().getMonth() === dob.getMonth() && new Date().getDate() < dob.getDate())) {
      age--;
    }

    // Check if age is between 16 and 70
    if (age < 16 || age > 70) {
      setError("Age must be between 16 and 70 years.");
      return;
    }

    // If age is valid, continue with registration
    setError(""); // Clear previous errors
    try {
      const result = await registerUser(formData);
      console.log("User registered:", result);
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input 
          name="name" 
          placeholder="Name" 
          value={formData.name}
          onChange={handleChange} 
          required 
        />
        <div className="error-message">
          {formData.name === '' && <span>Name is required</span>}
        </div>

        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange} 
          required 
        />
        <div className="error-message">
          {formData.email === '' && <span>Email is required</span>}
        </div>

        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={handleChange} 
          required 
        />
        <div className="error-message">
          {formData.password === '' && <span>Password is required</span>}
        </div>

        <input 
          name="dob" 
          type="date" 
          placeholder="Date of Birth" 
          value={formData.dob}
          onChange={handleChange} 
          required 
        />
        <div className="error-message">
          {formData.dob === '' && <span>Date of Birth is required</span>}
          {error && formData.dob && <span>{error}</span>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
