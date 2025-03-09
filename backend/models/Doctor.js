const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  specialty: String,
  qualification: String,
  availableDays: [String],
  availableTime: [String],
});
module.exports = mongoose.model("Doctor", doctorSchema);
