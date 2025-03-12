const Reception = require("../models/Reception");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Reception
const registerReception = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const receptionExists = await Reception.findOne({ email });

  if (receptionExists) return res.status(400).json({ message: "Receptionist already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const reception = await Reception.create({ name, email, password: hashedPassword, phone });

  res.status(201).json({ _id: reception.id, name: reception.name, email: reception.email });
};

// Login Reception
const loginReception = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Find reception staff by email
    const reception = await Reception.findOne({ email });
    if (!reception) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Check password validity
    const isMatch = await bcrypt.compare(password, reception.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token with role "reception"
    const token = jwt.sign({ id: reception.id, role: "reception" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ Store JWT in an HTTP-only cookie
    res
      .cookie("jwt", token, {
        httpOnly: true, // Secure: Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Enables secure cookies in production
        sameSite: "strict", // Prevents CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // Token expires in 1 day
      })
      .json({
        _id: reception.id,
        name: reception.name,
        email: reception.email,
        role: "reception",
      });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiration to remove cookie
  });

  res.json({ message: "Logged out successfully" });
};




// Get all Receptionists
const getReceptions = async (req, res) => {
  const receptions = await Reception.find({});
  res.json(receptions);
};

module.exports = { registerReception, loginReception, getReceptions, logout };
