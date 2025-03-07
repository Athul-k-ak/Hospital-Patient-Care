const express = require("express");
const { bookAppointment, getAppointments, getAppointmentsByDoctor } = require("../controllers/appointmentController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/book", protect, bookAppointment);
router.get("/", protect, getAppointments);
router.get("/by-doctor", protect, getAppointmentsByDoctor);

module.exports = router;
