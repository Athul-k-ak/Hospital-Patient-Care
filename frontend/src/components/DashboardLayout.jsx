import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/dashboard.css"; // Create a CSS file for layout styles

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-page">{children}
          
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
