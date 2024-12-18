const express = require('express');
const { registerEmployer, verifyEmail, loginEmployer } = require('../controllers/employerController');

const router = express.Router();

router.post('/register', registerEmployer);
router.post('/verify-email', verifyEmail);
router.post('/login', loginEmployer);

module.exports = router;
