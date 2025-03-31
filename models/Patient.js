const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  place: { type: String, required: true },  // ✅ Added place field
});

module.exports = mongoose.model("Patient", patientSchema);
