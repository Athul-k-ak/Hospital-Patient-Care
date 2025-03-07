const express = require("express");
const { registerReception, loginReception, getReceptions } = require("../controllers/receptionController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/register", registerReception);
router.post("/login", loginReception);
router.get("/", protect, getReceptions);

module.exports = router;
