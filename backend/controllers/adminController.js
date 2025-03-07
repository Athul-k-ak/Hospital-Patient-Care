const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

// Register Admin
// If no admin exists, allow registration without a token.
// Otherwise, only a valid admin token can register a new admin.
const registerAdmin = async (req, res) => {
  const adminCount = await Admin.countDocuments({});
  
  // If at least one admin exists, require a valid admin token.
  if (adminCount > 0) {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }
  }
  
  const { name, email, password, phone } = req.body;
  const adminExists = await Admin.findOne({ email });
  if (adminExists) return res.status(400).json({ message: "Admin already exists" });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashedPassword, phone });
  
  res.status(201).json({ _id: admin.id, name: admin.name, email: admin.email });
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  
  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "admin",
      token: generateToken(admin.id, "admin"),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// Get All Admins (Only Admins can access)
const getAdmins = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  
  const admins = await Admin.find({});
  res.json(admins);
};

// Delete Admin (Only Admin can delete)
// Delete Admin (Only Admin can delete)
const deleteAdmin = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }
    
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    
    // Use deleteOne() instead of remove()
    await admin.deleteOne();
    res.json({ message: "Admin removed" });
  };
  

module.exports = { registerAdmin, loginAdmin, getAdmins, deleteAdmin };
