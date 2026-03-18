const Notification = require('../models/notification');

// 📬 Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error fetching notifications' });
  }
};

// ✔️ Mark a specific notification as read
exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    // Ensure it belongs to the logged-in user
    if (!notification || notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Access denied or notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error updating notification' });
  }
};