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
  const { email, password } = req.body;
  const reception = await Reception.findOne({ email });

  if (reception && (await bcrypt.compare(password, reception.password))) {
    res.json({
      _id: reception.id,
      name: reception.name,
      email: reception.email,
      token: jwt.sign({ id: reception.id }, process.env.JWT_SECRET, { expiresIn: "30d" }),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// Get all Receptionists
const getReceptions = async (req, res) => {
  const receptions = await Reception.find({});
  res.json(receptions);
};

module.exports = { registerReception, loginReception, getReceptions };
