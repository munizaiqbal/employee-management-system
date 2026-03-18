const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { checkIn, checkOut, getMyAttendance } = require("../controller/attendanceController");

// ✅ Mark attendance (Check In / Check Out)
router.post("/mark", auth, (req, res) => {
  const { type } = req.body;

  if (type === "checkin") {
    return checkIn(req, res);
  }

  if (type === "checkout") {
    return checkOut(req, res);
  }

  return res.status(400).json({ msg: "Invalid attendance type" });
});

// ✅ Get logged-in user's attendance
router.get("/me", auth, getMyAttendance);

module.exports = router;