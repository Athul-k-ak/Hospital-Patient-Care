import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
import "../styles/staffreg.css"; // Use the same styling as other registration pages
import DashboardLayout from "../components/DashboardLayout";

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

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit file size to 2MB
        setError("File size should be less than 2MB");
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.age || !formData.gender || !formData.qualification || !formData.role || !formData.phone || !formData.place) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const res = await axios.post(
        "http://localhost:5000/api/staff/register",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201 || res.data.success) {
        setSuccess("Staff registered successfully! Redirecting...");
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        throw new Error(res.data.message || "Unexpected response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    
        <div className="form-container">
          <div className="signup-box">
            <h2>Register Staff</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleSignup}>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
              
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} required />
              
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Nurse">Nurse</option>
                <option value="Technician">Technician</option>
                <option value="Lab Assistant">Lab Assistant</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Security">Security</option>
              </select>
              
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <input type="text" name="place" placeholder="Place" value={formData.place} onChange={handleChange} required />
              
              <label className="file-label">
                Upload Profile Image (Optional)
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>

              {preview && <img src={preview} alt="Preview" className="profile-preview" />}

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register Staff"}
              </button>
            </form>
          </div>
        </div>
      
    </DashboardLayout>
  );
};

export default StaffRegister;
