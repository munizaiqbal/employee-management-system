const User = require("../models/user");
const ProfileUpdate = require("../models/profileUpdate");
const Notification = require("../models/notification");

// 🧑‍💼 Return current user's profile

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updater = req.user; // comes from auth middleware
    const newData = req.body;

    const originalUser = await User.findById(userId).lean();
    if (!originalUser) return res.status(404).json({ msg: "User not found" });

    const changedFields = [];
    for (const key in newData) {
      if (
        Object.prototype.hasOwnProperty.call(newData, key) &&
        newData[key] !== originalUser[key]
      ) {
        changedFields.push({
          field: key,
          oldValue: originalUser[key],
          newValue: newData[key],
        });
      }
    }

    // console.log('Changed Fields:', changedFields);

    await User.findByIdAndUpdate(userId, newData, { new: true });

    if (changedFields.length > 0) {
      await new ProfileUpdate({
        updatedBy: updater._id,
        targetUser: userId,
        fieldsChanged: changedFields,
        timestamp: new Date(),
      }).save();
    }

    res.status(200).json({
      msg: "User updated successfully",
      fieldsChanged: changedFields,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllEmployees = async (req, res) => {
  console.log(" getAllEmployees triggered");
  console.log("req.user:", req.user);

  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    console.log("👥 Found employees:", employees.length);

    res.json(employees);
  } catch (err) {
    console.error(" Error fetching employees:", err);
    res.status(500).json({ msg: "Server error while fetching employees" });
  }
};
