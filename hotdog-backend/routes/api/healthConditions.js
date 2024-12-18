const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { saveHealthConditions } = require('../../controllers/authController');

router.post('/health-conditions', authMiddleware, saveHealthConditions);

module.exports = router;
