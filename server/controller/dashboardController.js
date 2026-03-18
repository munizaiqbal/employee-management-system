const User = require('../models/user');
const Attendance = require('../models/attendance');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // get all attendance records today
    const attendanceToday = await Attendance.find({
      checkIn: { $gte: startOfDay, $lte: endOfDay }
    }).select("user"); // only need user field

    // filter out any records without user
    const validUsers = attendanceToday
      .filter(a => a.user)           // ignore null or undefined users
      .map(a => a.user.toString());  // convert ObjectId to string

    // unique present employees
    const uniqueUserIds = [...new Set(validUsers)];

    const presentToday = uniqueUserIds.length;
    const absentToday = totalEmployees - presentToday;

    res.status(200).json({
      totalEmployees,
      presentToday,
      absentToday
    });

  } catch (error) {
    console.error("❌ Dashboard Stats Error:", error);
    res.status(500).json({ msg: "Failed to load dashboard stats" });
  }
};

// GET ALL EMPLOYEES
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('username email');

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to load employees' });
  }
};


// GET PRESENT EMPLOYEES
exports.getPresentEmployees = async (req, res) => {
  try {

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const attendance = await Attendance.find({
      checkIn: { $gte: startOfDay, $lte: endOfDay }
    }).populate("user", "username email");

    const uniqueUsers = {};
    
    attendance.forEach(a => {
      if (a.user) uniqueUsers[a.user._id] = a.user;
    });

    res.json(Object.values(uniqueUsers));

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to load present employees" });
  }
};


// GET ABSENT EMPLOYEES
exports.getAbsentEmployees = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const attendance = await Attendance.find({
      checkIn: { $gte: startOfDay, $lte: endOfDay }
    }).select("user"); // only need user field

    // filter out null users
    const presentIds = [...new Set(
      attendance
        .filter(a => a.user)           // ignore null
        .map(a => a.user.toString())   // convert ObjectId to string
    )];

    const absentEmployees = await User.find({
      role: "employee",
      _id: { $nin: presentIds }
    }).select("username email");

    res.json(absentEmployees);

  } catch (error) {
    console.error("❌ Failed to load absent employees:", error);
    res.status(500).json({ msg: "Failed to load absent employees" });
  }
};