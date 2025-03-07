const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  appointmentToken: { type: Number, required: true }, // Add this field
});

module.exports = mongoose.model("Appointment", appointmentSchema);
