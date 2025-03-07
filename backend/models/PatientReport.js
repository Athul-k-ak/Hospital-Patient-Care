const mongoose = require("mongoose");

const patientReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  report: { type: String, required: true },
  prescription: { type: String },
  // Optional field: bloodUsed indicates blood used from the blood bank.
  bloodUsed: {
    bloodGroup: { type: String },
    units: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientReport", patientReportSchema);
