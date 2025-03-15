import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import ReceptionDashboard from "../pages/ReceptionDashboard";
import ProtectedRoute from "../routes/ProtectedRoute";
import RegisterPage from "../pages/RegisterPage";
import AdminRegister from "../pages/AdminRegister";
import DoctorRegister from "../pages/DoctorRegister";
import StaffRegister from "../pages/StaffRegister";
import ReceptionRegister from "../pages/ReceptionRegister";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/register" element={<RegisterPage />} />
          <Route path="/admin/register/admin" element={<AdminRegister />} />
          <Route path="/admin/register/doctor" element={<DoctorRegister />} />
          <Route path="/admin/register/staff" element={<StaffRegister />} />
          <Route path="/admin/register/reception" element={<ReceptionRegister />} />
        </Route>

        {/* Protected Routes for Doctor */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        {/* Protected Routes for Reception */}
        <Route element={<ProtectedRoute allowedRoles={["reception"]} />}>
          <Route path="/reception" element={<ReceptionDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
