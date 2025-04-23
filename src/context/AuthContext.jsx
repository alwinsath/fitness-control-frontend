import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create Context
const AuthContext = createContext();

// AuthProvider component to wrap the app and provide the context
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  // Load token from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Save token to localStorage on change
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('token', authToken);
    } else {
      localStorage.removeItem('token');
    }
  }, [authToken]);

  const login = (token) => setAuthToken(token);
  const logout = () => {
    setAuthToken(null);
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
