const express = require("express");
const { registerBlood, getBloodStock, checkBloodAvailability } = require("../controllers/bloodBankController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/register", protect, registerBlood);
router.get("/", protect, getBloodStock);
router.get("/availability", protect, checkBloodAvailability);

module.exports = router;
