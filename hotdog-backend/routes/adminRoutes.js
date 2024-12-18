const express = require('express');
// placeholder haha
const { registerAdmin, verifyEmail, loginAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/verify-email', verifyEmail);
router.post('/login', loginAdmin);

module.exports = router;
