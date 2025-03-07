const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
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
    const { patientName, doctorId, date, time } = req.body;

    // Validate doctorId.
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctorId" });
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

    // Validate appointment time against doctor's available time.
    if (!doctor.availableTime) {
      return res.status(400).json({ message: "Doctor available time not specified" });
    }
    const [startTimeStr, endTimeStr] = doctor.availableTime.split(" - ");
    const appointmentTimeMinutes = parseTime(time);
    const startTimeMinutes = parseTime(startTimeStr);
    const endTimeMinutes = parseTime(endTimeStr);
    if (appointmentTimeMinutes < startTimeMinutes || appointmentTimeMinutes > endTimeMinutes) {
      return res.status(400).json({ 
        message: `Doctor is not available at ${time}. Available time is ${doctor.availableTime}` 
      });
    }

    // Generate a sequential appointment token number for this doctor on the given date.
    // Find the latest appointment (if any) for this doctor and date.
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

    // Create the appointment with the new token number.
    const appointment = await Appointment.create({ 
      patientName, 
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
    // Populate the doctorId field to show the doctor's name.
    const appointments = await Appointment.find({}).populate("doctorId", "name");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// New endpoint: Get Appointments Grouped by Doctor.
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
            patientName: "$patientName",
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
