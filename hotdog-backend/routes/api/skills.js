const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { saveSkills } = require('../../controllers/authController');

router.post('/skills', authMiddleware, saveSkills);

module.exports = router;
