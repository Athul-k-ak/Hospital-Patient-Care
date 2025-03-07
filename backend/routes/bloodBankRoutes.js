const express = require("express");
const { registerBlood, getBloodStock } = require("../controllers/bloodBankController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/register", protect, registerBlood);
router.get("/", protect, getBloodStock);

module.exports = router;
