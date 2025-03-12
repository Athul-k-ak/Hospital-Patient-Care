const Staff = require("../models/Staff");

// ✅ Add Staff (Only Admin)
const addStaff = async (req, res) => {
    try {
      const { name, age, gender, qualification, role, phone, place, profileImage } = req.body;
  
      const staff = new Staff({ name, age, gender, qualification, role, phone, place, profileImage });
      await staff.save();
  
      res.status(201).json({ message: "Staff added successfully", staff });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.phone) {
        return res.status(400).json({ message: "Phone number already exists. Please use a different number." });
      }
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  module.exports = { addStaff };

// ✅ Edit Staff (Only Admin)
const editStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const updatedData = req.body;

    const updatedStaff = await Staff.findByIdAndUpdate(staffId, updatedData, { new: true });

    if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });

    res.json({ message: "Staff updated successfully", updatedStaff });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete Staff (Only Admin)
const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const staff = await Staff.findByIdAndDelete(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ List All Staff (Only Admin)
const listStaff = async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json({ staff: staffList });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { addStaff, editStaff, deleteStaff, listStaff };
