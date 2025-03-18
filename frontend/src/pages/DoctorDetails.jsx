import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/doctorDetails.css";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctor/${id}`, {
          withCredentials: true,
        });
        setDoctor(res.data);
      } catch (err) {
        setError("Failed to fetch doctor details");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="doctor-details-container">
        {/* Show loading inside the same page */}
        {loading && <p className="loading-text">⏳ Loading doctor details...</p>}

        {/* Show error if data fetching fails */}
        {error && <p className="error">{error}</p>}

        {/* Only render details when data is available */}
        {!loading && doctor && (
          <div className="doctor-details-box">
            {/* Left Side - Doctor Photo */}
            <div className="doctor-photo-section">
              <img
                src={doctor.profileImage || "/default-doctor.png"}
                alt={doctor.name}
                className="doctor-profile-img"
              />
            </div>

            {/* Right Side - Doctor Information */}
            <div className="doctor-info-section">
              <h2 className="doctor-name">{doctor.name.replace(/"/g, "")}</h2>
              <p className="doctor-specialty">{doctor.specialty.replace(/"/g, "")}</p>

              <div className="doctor-info">
                <p><strong>Phone:</strong> {doctor.phone.replace(/"/g, "")}</p>
                <p><strong>Email:</strong> {doctor.email.replace(/"/g, "")}</p>
                <p><strong>Qualification:</strong> {doctor.qualification.replace(/"/g, "")}</p>
                <p><strong>Available Days:</strong> {doctor.availableDays.join(", ")}</p>
                <p><strong>Available Time:</strong> {doctor.availableTime.join(", ")}</p>
              </div>

              <button className="doctor-details-back-btn" onClick={() => navigate(-1)}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDetails;
