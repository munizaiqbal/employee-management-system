const router = require('express').Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  getAllUpdates,
  getUserUpdateHistory
} = require('../controller/profileUpdateController');

// Admin: all logs
router.get('/', auth, adminOnly, getAllUpdates);

// Employee: own change history
router.get('/me', auth, getUserUpdateHistory);

module.exports = router;