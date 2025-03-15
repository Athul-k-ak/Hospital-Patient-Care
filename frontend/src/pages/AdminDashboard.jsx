import DashboardLayout from "../components/DashboardLayout";
import "../styles/dashboard.css";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-welcome">
        <h2>Welcome, Admin!</h2>
        <p>Manage hospital operations efficiently from your dashboard.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Patients</h3>
          <p>1,245</p>
        </div>
        <div className="dashboard-card">
          <h3>Doctors Available</h3>
          <p>30</p>
        </div>
        <div className="dashboard-card">
          <h3>Appointments Today</h3>
          <p>120</p>
        </div>
        <div className="dashboard-card">
          <h3>Staff Members</h3>
          <p>85</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
