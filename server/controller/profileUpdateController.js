const ProfileUpdate = require('../models/profileUpdate');

// 🛡️ Admin: Get all profile updates across the system
exports.getAllUpdates = async (req, res) => {
  try {
    const logs = await ProfileUpdate.find()
      .populate('updatedBy', 'username role email')   // who made the change
      .populate('targetUser', 'username role email')  // whose profile was changed
      .sort({ timestamp: -1 }); // latest first

    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while fetching profile update logs' });
  }
};

// 👤 Employee: View only their own profile update history
exports.getUserUpdateHistory = async (req, res) => {
  try {
    const logs = await ProfileUpdate.find({ targetUser: req.user._id })
      .populate('updatedBy', 'username role email')
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while fetching your update history' });
  }
};