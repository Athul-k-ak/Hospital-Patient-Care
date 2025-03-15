import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const DoctorDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar links={[{ path: "/doctor", label: "Dashboard" }]} />
      <div className="dashboard-content">
        <Navbar title="Doctor Dashboard" />
        <h2>Welcome, Doctor!</h2>
      </div>
    </div>
  );
};

export default DoctorDashboard;
