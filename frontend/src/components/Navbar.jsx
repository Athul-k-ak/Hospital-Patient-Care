import { useState, useEffect } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import "../styles/navbar.css";

const Navbar = () => {
  const [user, setUser] = useState({ name: "", role: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage (or API if needed)
    const storedUser = {
      name: localStorage.getItem("userName") || "User",
      role: localStorage.getItem("role") || "Guest",
    };
    setUser(storedUser);
  }, []);

  return (
  <div className="navbar-container">
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Hospital Logo" className="hospital-logo" />
        <span className="hospital-name">Your Hospital</span>
      </div>

      <div className="navbar-right">
        <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaUserCircle className="user-icon" />
          <span>{user.name} ({user.role})</span>
          <FaCaretDown className="dropdown-icon" />
        </div>

        {/* {dropdownOpen && (
          <div className="dropdown-menu">
            <a href="/profile">View Profile</a>
            <a href="/settings">Settings</a>
          </div>
        )} */}
      </div>
    </nav>
  </div>
  );
};

export default Navbar;
