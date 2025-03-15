import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaUserMd, FaUsers, FaClipboardList,
  FaTint, FaCalendarAlt, FaCog, FaSignOutAlt
} from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = {
    admin: [
      { name: "Home", path: "/admin", icon: <FaHome /> },
      { name: "Register", path: "/admin/register", icon: <FaUserMd /> },
      { name: "Register Patients", path: "/admin/register-patient", icon: <FaUsers /> },
      { name: "Patient List", path: "/admin/patient-list", icon: <FaClipboardList /> },
      { name: "Doctor List", path: "/admin/doctor-list", icon: <FaUserMd /> },
      { name: "Patient Report", path: "/admin/patient-report", icon: <FaClipboardList /> },
      { name: "Blood Bank", path: "/admin/blood-bank", icon: <FaTint /> },
      { name: "Appointments", path: "/admin/appointments", icon: <FaCalendarAlt /> },
      { name: "Accounts", path: "/admin/accounts", icon: <FaUsers /> },
    ],
    doctor: [
      { name: "Home", path: "/doctor", icon: <FaHome /> },
      { name: "Patient List", path: "/doctor/patient-list", icon: <FaClipboardList /> },
      { name: "Appointments", path: "/doctor/appointments", icon: <FaCalendarAlt /> },
      { name: "Patient Report", path: "/doctor/patient-report", icon: <FaClipboardList /> },
    ],
    reception: [
      { name: "Home", path: "/reception", icon: <FaHome /> },
      { name: "Register Patients", path: "/reception/register-patient", icon: <FaUsers /> },
      { name: "Appointments", path: "/reception/appointments", icon: <FaCalendarAlt /> },
    ],
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "→" : "←"}
      </button>

      {/* Scrollable Menu */}
      <div className="sidebar-content">
        <ul className="menu">
          {menuItems[role]?.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
                {item.icon} {!isCollapsed && item.name}
              </NavLink>
              
            </li>
            
          ))}
         
        </ul>
      </div>

      {/* Fixed Bottom Section for Settings and Logout */}
      <div className="sidebar-footer">
        <NavLink to="/settings" className="sidebar-link">
          <FaCog /> {!isCollapsed && "Settings"}
        </NavLink>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> {!isCollapsed && "Logout"}
        </button>
        
      </div>
    </div>
  );
};

export default Sidebar;
