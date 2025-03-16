import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/staffRegister.css";

const StaffRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    qualification: "",
    role: "",
    phone: "",
    place: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setFormData({ ...formData, profileImage: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setError("File size should be less than 2MB");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.name || !formData.age || !formData.gender || !formData.qualification || !formData.role || !formData.phone || !formData.place) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const res = await axios.post(
        "http://localhost:5000/api/staff/add",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.data.success) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        throw new Error(res.data.message || "Unexpected response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="staff-signup-container">
        <div className="staff-signup-box">
          <h2>Register Staff</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
          <form onSubmit={handleSignup} className="staff-form-container">
            <div className="staff-left">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} required />
              <input type="text" name="place" placeholder="Place" value={formData.place} onChange={handleChange} required />
              
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
             
            </div>

            <div className="staff-right">
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Nurse">Nurse</option>
                <option value="Technician">Technician</option>
                <option value="Lab Assistant">Lab Assistant</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Security">Security</option>
              </select><br /><br />
              <div className="staff-label">
              <label className="staff-file-label">
                Upload Profile Image (Optional)
              </label>
              </div>
              <div className="staff-file-upload">
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>


            <div className="staff-buttons">
              <button className="staff-signup-btn" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <button className="staff-back-btn" onClick={() => navigate(-1)}>← Back</button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffRegister;
