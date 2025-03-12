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

  // Generate JWT token
  const token = generateToken(admin.id, "admin");

  // Store token in HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({ _id: admin.id, name: admin.name, email: admin.email });
};


// Login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    const token = generateToken(admin.id, "admin");

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ _id: admin.id, name: admin.name, email: admin.email, role: "admin" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const logoutAdmin = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
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
  

module.exports = { registerAdmin, loginAdmin,logoutAdmin, getAdmins, deleteAdmin };
