const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const mongoose = require("mongoose");

// Helper: Parse a time string (e.g., "10:00 AM") into minutes since midnight.
const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const bookAppointment = async (req, res) => {
  try {
    // Destructure required fields from request body.
    // Accept either an existing patientId or a new patient object for registration.
    const { patientId, patient, doctorId, date, time } = req.body;
    
    // Validate doctorId.
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    
    // Determine patientId and patientName:
    let finalPatientId;
    let finalPatientName;
    if (patientId) {
      // If a patientId is provided, validate that the patient exists.
      const existingPatient = await Patient.findById(patientId);
      if (!existingPatient) {
        return res.status(400).json({ message: "Patient not found" });
      }
      finalPatientId = patientId;
      finalPatientName = existingPatient.name;
    } else if (patient) {
      // Register new patient. Expect patient to contain name, age, gender, and phone.
      const { name, age, gender, phone } = patient;
      if (!name || !age || !gender || !phone) {
        return res.status(400).json({ message: "Incomplete patient details" });
      }
      const newPatient = await Patient.create({ name, age, gender, phone });
      finalPatientId = newPatient._id;
      finalPatientName = newPatient.name;
    } else {
      return res.status(400).json({ message: "Patient details are required" });
    }
    
    // Fetch the doctor details.
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    
    // Validate appointment day: Convert the provided date to a day name.
    const appointmentDate = new Date(date);
    const appointmentDay = appointmentDate.toLocaleDateString("en-US", { weekday: "long" });
    if (!doctor.availableDays.includes(appointmentDay)) {
      return res.status(400).json({ 
        message: `Doctor is not available on ${appointmentDay}. Available days: ${doctor.availableDays.join(", ")}` 
      });
    }
    
    // Validate appointment time against doctor's available time slots.
    if (!doctor.availableTime || !Array.isArray(doctor.availableTime) || doctor.availableTime.length === 0) {
      return res.status(400).json({ message: "Doctor available time not specified" });
    }
    
    const appointmentTimeMinutes = parseTime(time);
    let isWithinSlot = false;
    for (const slot of doctor.availableTime) {
      if (typeof slot !== "string") continue; // Skip non-string slots.
      const timeParts = slot.split(" - ");
      if (timeParts.length !== 2) continue; // Skip if format is incorrect.
      const [startTimeStr, endTimeStr] = timeParts;
      const startTimeMinutes = parseTime(startTimeStr);
      const endTimeMinutes = parseTime(endTimeStr);
      if (appointmentTimeMinutes >= startTimeMinutes && appointmentTimeMinutes <= endTimeMinutes) {
        isWithinSlot = true;
        break;
      }
    }
    if (!isWithinSlot) {
      return res.status(400).json({ 
        message: `Doctor is not available at ${time}. Available time slots: ${doctor.availableTime.join("; ")}`
      });
    }
    
    // Generate a sequential appointment token number for this doctor on the given date.
    const latestAppointment = await Appointment.findOne({ doctorId, date }).sort({ appointmentToken: -1 });
    let newToken = 1;
    if (latestAppointment) {
      const lastToken = Number(latestAppointment.appointmentToken);
      if (!isNaN(lastToken)) {
        newToken = lastToken + 1;
      }
    }
    if (newToken > 1000) {
      return res.status(400).json({ message: "No appointment tokens available for today" });
    }
    
    // Create the appointment with patientId and patientName.
    const appointment = await Appointment.create({ 
      patientId: finalPatientId, 
      patientName: finalPatientName,
      doctorId, 
      date, 
      time, 
      appointmentToken: newToken 
    });
    
    // Return the appointment details, including the doctor's name and the appointment token.
    res.status(201).json({ 
      message: "Appointment booked successfully", 
      appointment, 
      doctorName: doctor.name,
      appointmentToken: newToken
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    // Populate the doctorId and patientId fields.
    const appointments = await Appointment.find({})
      .populate("doctorId", "name")
      .populate("patientId", "name age gender phone");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Appointments Grouped by Doctor.
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointmentsByDoctor = await Appointment.aggregate([
      {
        $lookup: {
          from: "doctors", // Ensure this matches your collection name.
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id: "$doctor._id",
          doctorName: { $first: "$doctor.name" },
          appointments: { $push: {
            _id: "$_id",
            patientId: "$patientId",
            date: "$date",
            time: "$time",
            appointmentToken: "$appointmentToken"
          }}
        }
      },
      {
        $project: {
          _id: 0,
          doctorId: "$_id",
          doctorName: 1,
          appointments: 1
        }
      }
    ]);
    res.json(appointmentsByDoctor);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { bookAppointment, getAppointments, getAppointmentsByDoctor };
