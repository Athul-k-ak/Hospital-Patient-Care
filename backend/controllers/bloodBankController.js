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
const checkBloodAvailability = async (req, res) => {
    try {
      let { bloodGroup } = req.query;
      if (!bloodGroup) {
        return res.status(400).json({ message: "bloodGroup query parameter is required" });
      }
      
      // Trim and standardize the query parameter.
      const trimmedBloodGroup = bloodGroup.trim();
      
      // For partial matching: match any blood group that starts with the given value (case-insensitive)
      const bloodGroupRegex = new RegExp(`^${trimmedBloodGroup}`, "i");
      
      // If you want exact matching, use:
      // const bloodGroupRegex = new RegExp(`^${trimmedBloodGroup}$`, "i");
      
      const result = await BloodBank.aggregate([
        { $match: { bloodGroup: bloodGroupRegex } },
        { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
      ]);
      
      let totalQuantity = result.length > 0 ? result[0].totalQuantity : 0;
      res.json({ bloodGroup: trimmedBloodGroup, totalQuantity, available: totalQuantity > 0 });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  
  module.exports = { registerBlood, getBloodStock, checkBloodAvailability };