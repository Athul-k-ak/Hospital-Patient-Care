const express = require("express");
const {addStaff, editStaff, deleteStaff, listStaff } = require("../controllers/staffController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ✅ Only Admin can add staff (excluding doctor, reception, and admin)
router.post("/add", protect, authorizeRoles("admin"), addStaff);
router.put("/edit/:staffId", protect, authorizeRoles("admin"), editStaff);
router.delete("/delete/:staffId", protect, authorizeRoles("admin"), deleteStaff);
router.get("/list", protect, authorizeRoles("admin"), listStaff);

module.exports = router;
