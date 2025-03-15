import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
import "../styles/register.css";
import DashboardLayout from "../components/DashboardLayout";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
     <DashboardLayout>
        <div className="register-container">
          <h2>Select Registration Type</h2>
          <div className="register-options">
            <div className="register-card" onClick={() => navigate("/admin/register/admin")}>
              <h3>Register Admin</h3>
            </div>
            <div className="register-card" onClick={() => navigate("/admin/register/doctor")}>
              <h3>Register Doctor</h3>
            </div>
            <div className="register-card" onClick={() => navigate("/admin/register/staff")}>
              <h3>Register Staff</h3>
            </div>
            <div className="register-card" onClick={() => navigate("/admin/register/reception")}>
              <h3>Register Receptionist</h3>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default RegisterPage;
