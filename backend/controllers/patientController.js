const Patient = require("../models/Patient");

// Register Patient (No "disease" field)
const registerPatient = async (req, res) => {
  const { name, age, gender, phone } = req.body;
  const patient = await Patient.create({ name, age, gender, phone });

  res.status(201).json(patient);
};

// Get all Patients (Only Admin and Reception can access)
const getPatients = async (req, res) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "reception")) {
    return res.status(403).json({ message: "Access denied" });
  }

  const patients = await Patient.find({});
  res.json(patients);
};

module.exports = { registerPatient, getPatients };
