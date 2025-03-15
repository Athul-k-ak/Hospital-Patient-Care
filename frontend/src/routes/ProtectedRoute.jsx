import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "guest"; // Default to "guest"
    setRole(storedRole.toLowerCase()); // Normalize case
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
