const BloodBank = require("../models/BloodBank");

// Register Blood Donation
const registerBlood = async (req, res) => {
  const { donorName, bloodGroup, age, phone, gender, quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  const bloodEntry = await BloodBank.create({ donorName, bloodGroup, age, phone, gender, quantity });
  res.status(201).json(bloodEntry);
};

// Get Blood Stock
const getBloodStock = async (req, res) => {
  const bloodStock = await BloodBank.find({});
  res.json(bloodStock);
};

module.exports = { registerBlood, getBloodStock };
