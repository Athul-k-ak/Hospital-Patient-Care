const express = require("express");
const { registerDoctor, loginDoctor, getDoctors, logout } = require("../controllers/doctorController");
const protect = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

router.post("/signup", protect, registerDoctor); // ✅ Ensure protect is applied
router.post("/login", loginDoctor);
router.post("/logout", logout);
router.get("/", protect, getDoctors);

module.exports = router;
