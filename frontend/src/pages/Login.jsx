import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css"; // Import separate login styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const navigate = useNavigate();

  // Check if admin exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/check-admin");
        setAdminExists(res.data.adminExists);
      } catch (err) {
        console.error("Error checking admin:", err);
        setAdminExists(false); // Assume no admin if API fails
      }
    };
    checkAdmin();
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
  
      const user = res.data.user;
      
      if (user) {
        localStorage.setItem("userName", user.name); // ✅ Store user name
        localStorage.setItem("role", user.role);     // ✅ Store user role
      }
  
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "doctor") navigate("/doctor");
      else if (user.role === "reception") navigate("/reception");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {!adminExists && (
          <p className="signup-link">
            No admin account? <a href="/signup">Register Admin</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
