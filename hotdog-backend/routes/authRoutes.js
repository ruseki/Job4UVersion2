const express = require('express');
const { login, registerUser, verifyEmail, saveSkills, saveHealthConditions, forgotPassword, resetPassword, resendVerificationCode } = require('../controllers/authController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/save-skills', saveSkills);
router.post('/save-health-conditions', saveHealthConditions);
router.post('/forgot-password', forgotPassword); /* tinanggal ko ung comment. PLS wag nyo aalisin etong mga comment kase palatandaan ko*/
router.post('/reset-password', resetPassword);
router.post('/resend-verification-code', resendVerificationCode);
    
module.exports = router;
