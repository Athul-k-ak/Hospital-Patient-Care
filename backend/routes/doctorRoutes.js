const express = require("express");
const { registerDoctor, loginDoctor, getDoctors, logout } = require("../controllers/doctorController");
const protect = require("../middleware/authMiddleware"); // Import middleware
const upload = require("../middleware/uploadMiddleware");


const router = express.Router();

router.post("/signup", upload.single("profileImage"),protect, registerDoctor); // ✅ Ensure protect is applied
router.post("/login", loginDoctor);
router.post("/logout", logout);
router.get("/", protect, getDoctors);

module.exports = router;
