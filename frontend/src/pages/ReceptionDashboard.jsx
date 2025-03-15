import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const ReceptionDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar links={[{ path: "/reception", label: "Dashboard" }]} />
      <div className="dashboard-content">
        <Navbar title="Reception Dashboard" />
        <h2>Welcome, Receptionist!</h2>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
