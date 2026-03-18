const router = require('express').Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { updateUserProfile, getUserProfile ,getAllEmployees  } = require('../controller/userController');





router.get('/me', auth, getUserProfile);
router.put('/:id/update', auth, updateUserProfile);
router.get('/employees', auth, adminOnly, getAllEmployees);


module.exports = router;