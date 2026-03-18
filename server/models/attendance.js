const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  checkIn: Date,
  checkInTime: String,
  checkOut: Date,
  checkOutTime: String
});

module.exports = mongoose.model('Attendance', attendanceSchema);