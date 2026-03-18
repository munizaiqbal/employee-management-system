const Attendance = require('../models/attendance');
const Notification = require('../models/notification');
const User = require('../models/user');

// ⏰ Check-In Handler
exports.checkIn = async (req, res) => {
  try {
    const now = new Date();
    const dateOnly = now.toISOString().split('T')[0];
    const timeOnly = now.toLocaleTimeString();

    // Prevent double check-in
    const alreadyCheckedIn = await Attendance.findOne({
      user: req.user._id,
      date: dateOnly
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({ msg: 'Already checked in today.' });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      user: req.user._id,
      checkIn: now,
      checkInTime: timeOnly,
      date: dateOnly
    });

    // Notify employee
    await Notification.create({
      recipient: req.user._id,
      message: `You checked in at ${timeOnly}`,
      type: 'checkin'
    });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map(admin => ({
      recipient: admin._id,
      message: `${req.user.username} checked in at ${timeOnly}`,
      type: 'checkin'
    }));
    await Notification.insertMany(adminNotifications);

    res.status(200).json({ msg: 'Check-in successful', attendance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during check-in' });
  }
};

// ⏳ Check-Out Handler
exports.checkOut = async (req, res) => {
  try {
    const now = new Date();
    const timeOnly = now.toLocaleTimeString();
    const dateOnly = now.toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ user: req.user._id, date: dateOnly });

    if (!attendance) return res.status(404).json({ msg: 'You have not checked in today.' });
    if (attendance.checkOut) return res.status(400).json({ msg: 'Already checked out.' });

    attendance.checkOut = now;
    attendance.checkOutTime = timeOnly;
    await attendance.save();

    // Notify employee
    await Notification.create({
      recipient: req.user._id,
      message: `You checked out at ${timeOnly}`,
      type: 'checkout'
    });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map(admin => ({
      recipient: admin._id,
      message: `${req.user.username} checked out at ${timeOnly}`,
      type: 'checkout'
    }));
    await Notification.insertMany(adminNotifications);

    res.status(200).json({ msg: 'Check-out successful', attendance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during check-out' });
  }
};

// 📅 Attendance History
exports.getMyAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate('user', 'username email');

    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while fetching attendance history' });
  }
};