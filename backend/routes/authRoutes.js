const express = require("express");
const { login, logout } = require("../controllers/authController");

const router = express.Router();

// Login Route
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
