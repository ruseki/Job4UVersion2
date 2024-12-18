const express = require('express');
const router = express.Router();
const { createUser, verifyOTP } = require("../controllers/userController");
const authMiddleware = require('../middlewares/authMiddleware');
const Job = require('../models/Job');

router.post("/register", createUser); 
router.post("/verify-otp", verifyOTP); 
router.get('/', (req, res) => {
  res.send('user routes is working');
});

// Route to get user dashboard jobs
router.get('/jobs', authMiddleware, async (req, res) => { // Updated the path here
  try {
    const jobs = await Job.find().populate('createdBy', 'organization_name organization_email');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
