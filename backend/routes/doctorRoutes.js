const express = require("express");
const { registerDoctor, loginDoctor, getDoctors } = require("../controllers/doctorController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/register", protect, authorizeRoles("admin"), registerDoctor);
router.post("/login", loginDoctor);
router.get("/", protect, authorizeRoles("admin", "reception"), getDoctors);

module.exports = router;
