const router = require('express').Router();
const auth = require('../middleware/auth');
const { getNotifications, markRead } = require('../controller/notificationController');

router.get('/', auth, getNotifications);
router.put('/mark-read/:id', auth, markRead);

module.exports = router;