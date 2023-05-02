const router = require('express').Router();
const authController = require('./controllers/auth-controller');
const AuthController = require('./controllers/auth-controller');

router.post('/api/send-otp', authController.sendOtp);

module.exports = router;