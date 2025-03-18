import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/doctorList.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loadingDoctor, setLoadingDoctor] = useState(false); // 🔹 Loading for doctor details
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctor", {
          withCredentials: true,
        });
        setDoctors(res.data);
      } catch (err) {
        setError("Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  // 🔹 Handle Doctor Click (Stay on page while loading)
  const handleDoctorClick = async (doctorId) => {
    setLoadingDoctor(true); // Show loading message on the same page
    try {
      await axios.get(`http://localhost:5000/api/doctor/${doctorId}`, {
        withCredentials: true,
      });
      navigate(`/admin/doctor/${doctorId}`);
    } catch (err) {
      alert("Failed to fetch doctor details.");
    }
    setLoadingDoctor(false);
  };

  // 🔹 Download Table as PDF
  const handleDownloadPDF = () => {
    if (filteredDoctors.length === 0) {
      alert("No doctors available to download!");
      return;
    }

    const doc = new jsPDF();
    doc.text("Doctor List", 15, 10);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Specialty"]],
      body: filteredDoctors.map((doctor) => [doctor.name, doctor.specialty]),
    });
    doc.save("Doctor_List.pdf");
  };

  // 🔍 Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="doctor-list-container">
        {error && <p className="error">{error}</p>}

        <h2>Doctor List</h2>

        {/* 🔹 Show Loading at the Top (Without navigating) */}
        {loadingDoctor && <p className="loading-text">⏳ Loading doctor details...</p>}

        {/* Search Box */}
        <input
          type="text"
          placeholder="🔍 Search doctor by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />

        {/* Button for Download PDF */}
        <div className="actions">
          <button
            onClick={handleDownloadPDF}
            className="pdf-btn"
            disabled={filteredDoctors.length === 0}
          >
            📥 Download PDF
          </button>
        </div>

        {/* Doctor List Table */}
        <div className="table-wrapper">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
              </tr>
            </thead>
            <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    
                    <td
                      className="doctor-name"
                      onClick={() => handleDoctorClick(doctor._id)}
                      style={{ cursor: "pointer" }}
                    >
                      {doctor.name.replace(/"/g, "")}
                    </td>
                    <td>{doctor.specialty.replace(/"/g, "")}</td>
                  </tr>
                ))}
              </tbody>

          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorList;
