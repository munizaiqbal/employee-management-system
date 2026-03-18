const mongoose = require('mongoose');

const profileUpdateSchema = new mongoose.Schema({
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fieldsChanged: [{ field: { type: String, required: true },
oldValue: mongoose.Schema.Types.Mixed,
newValue: mongoose.Schema.Types.Mixed}],

  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfileUpdate', profileUpdateSchema);
