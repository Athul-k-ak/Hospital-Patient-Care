import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/doctorreg.css";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    qualification: "",
    availableDays: [],
    availableTime: [],
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

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
        ? [...prevData[name], value]
        : prevData[name].filter((item) => item !== value),
    }));
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.specialty ||
      !formData.qualification ||
      formData.availableDays.length === 0 ||
      formData.availableTime.length === 0
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "profileImage" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        }
      });

      const res = await axios.post("http://localhost:5000/api/doctor/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.status === 201 || res.data.success) {
        setSuccess("Doctor registered successfully! Redirecting...");
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        throw new Error(res.data.message || "Unexpected response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="doctor-register-container">
        <form className="doctor-register-box" onSubmit={handleSignup}>
          {/* Left Section - General Details */}
          <div className="form-section">
            <h2>Doctor Registration</h2>

            <label>Name</label><br />
            <input type="text" name="name" value={formData.name} onChange={handleChange} required /><br />

            <label>Email</label><br />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required /><br />

            <label>Password</label><br />
            <input type="password" name="password" value={formData.password} onChange={handleChange} required /><br />

            <label>Phone</label><br />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /><br />

            <label>Specialty</label><br />
            <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required /><br />

            <label>Qualification</label><br />
            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required /><br />

            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} /><br />
            {/* {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />} */}
            <button className="back-btn" onClick={() => navigate(-1)}>Back ←</button>

          </div>

          {/* Right Section - Availability */}
          <div className="form-section">
            <h3>Available Days</h3>
            <div className="checkbox-group">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <label key={day} className="checkbox-label">
                  <input type="checkbox" name="availableDays" value={day} onChange={handleCheckboxChange} />
                  {day}
                </label>
              ))}
            </div>

            <h3>Available Time Slots</h3>
            <div className="checkbox-group">
              {["09:00 AM - 11:00 AM","11:00 AM - 01:00 PM","01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM"].map((time) => (
                <label key={time} className="checkbox-label">
                  <input type="checkbox" name="availableTime" value={time} onChange={handleCheckboxChange} />
                  {time}
                </label>
              ))}
            </div>
            <br /><br /><br />

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <button type="submit" className="doctor-register-button" disabled={loading}>
              {loading ? "Registering..." : "Register Doctor"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DoctorRegister;
