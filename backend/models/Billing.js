const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  patientName: { type: String, required: true },  // New field to store patient's name.
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }, // Optional.
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  billingDate: { type: Date, default: Date.now },
  details: { type: String }
});

module.exports = mongoose.model("Billing", billingSchema);
