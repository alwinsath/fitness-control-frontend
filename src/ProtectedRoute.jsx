import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");  // Get token from local storage

  if (!token) {
    return <Navigate to="/login" />;  // Redirect to login if no token exists
  }

  return children;  // Allow access if token exists
};

export default ProtectedRoute;
