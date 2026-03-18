const router = require('express').Router();
const {
  getDashboardStats,
  getAllEmployees,
  getPresentEmployees,
  getAbsentEmployees
} = require('../controller/dashboardController');

const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/stats', auth, adminOnly, getDashboardStats);

// NEW ROUTES
router.get('/employees', auth, adminOnly, getAllEmployees);
router.get('/present', auth, adminOnly, getPresentEmployees);
router.get('/absent', auth, adminOnly, getAbsentEmployees);

module.exports = router;