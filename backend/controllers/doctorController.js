const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Doctor (Only Admin can add)
const registerDoctor = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  
  const { name, email, password, phone, specialty, qualification, availableDays, availableTime } = req.body;
  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) return res.status(400).json({ message: "Doctor already exists" });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const doctor = await Doctor.create({
    name,
    email,
    password: hashedPassword,
    phone,
    specialty,
    qualification,
    availableDays,
    availableTime,
  });
  
  res.status(201).json({ _id: doctor.id, name: doctor.name, email: doctor.email });
};

// Login Doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Ensure doctor has a password before comparing
    if (!doctor.password) {
      return res.status(500).json({ message: "Doctor password is missing in database" });
    }
    
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    res.json({
      _id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      role: "doctor",
      token: jwt.sign({ id: doctor.id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "30d" }),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all Doctors (Only Admin & Reception can list Doctors)
const getDoctors = async (req, res) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "reception")) {
    return res.status(403).json({ message: "Access Denied" });
  }
  
  const doctors = await Doctor.find({});
  res.json(doctors);
};

module.exports = { registerDoctor, loginDoctor, getDoctors };
