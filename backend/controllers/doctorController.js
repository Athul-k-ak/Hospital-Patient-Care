const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Doctor (Only Admin can add)
const registerDoctor = async (req, res) => {
  console.log("🔍 Received Request to Register Doctor");
  console.log("✅ Authenticated User:", req.user);

  if (!req.user) {
    console.log("❌ req.user is undefined");
    return res.status(401).json({ message: "Unauthorized: No user found in request" });
  }

  console.log("✅ User Role:", req.user.role);

  if (req.user.role !== "admin") {
    console.log("❌ Access Denied: User is not an admin");
    return res.status(403).json({ message: "Access Denied" });
  }

  const { name, email, password, phone, specialty, qualification, availableDays, availableTime } = req.body;

  if (!name || !email || !password || !phone || !specialty || !qualification || !availableDays || !availableTime) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log("🔍 Checking if doctor already exists");
  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    console.log("❌ Doctor already exists");
    return res.status(400).json({ message: "Doctor already exists" });
  }

  console.log("✅ Hashing Password");
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("✅ Creating Doctor");
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

  console.log("✅ Doctor Registered Successfully:", doctor);
  res.status(201).json({ _id: doctor.id, name: doctor.name, email: doctor.email });
};

// Login Doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields.
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Find the doctor by email.
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Ensure a password exists and compare.
    if (!doctor.password) {
      return res.status(500).json({ message: "Doctor password is missing in database" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Generate token with role "doctor"
    const token = jwt.sign({ id: doctor.id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.json({
      _id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      role: "doctor",
      token
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all Doctors (Accessible by Admin & Reception)
const getDoctors = async (req, res) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "reception")) {
    return res.status(403).json({ message: "Access Denied" });
  }
  
  const doctors = await Doctor.find({});
  res.json(doctors);
};

module.exports = { registerDoctor, loginDoctor, getDoctors };
