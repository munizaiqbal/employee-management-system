const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controller/authController');

const auth = require('../middleware/auth');
console.log("✅ Auth routes file loaded");
router.get('/test', (req, res) => {
  res.send("Auth routes working");
});

router.post('/login', login); // login for both roles
router.post('/register', register); // admin creates employee
router.get('/me', auth, getMe);

module.exports = router;