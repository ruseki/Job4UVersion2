const Employer = require('../models/Employer');
const User = require('../models/User');
const Admin = require('../models/Admin'); 
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// nagpupu lang       sige, ilabas mo muna yan        

exports.registerEmployer = async (req, res) => {
    const { organization_email, password, confirm_password, ...rest } = req.body;

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const userExists = await User.findOne({ email: organization_email });
        const employerExists = await Employer.findOne({ organization_email });
        const adminExists = await Admin.findOne({ email: organization_email });

        if (userExists || employerExists || adminExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const verificationCode = crypto.randomBytes(20).toString('hex');
        const newEmployer = new Employer({
            organization_email,
            password,
            plain_text_password: password,
            verificationCode,
            userType: 'employer', 
            ...rest
        });

        await newEmployer.save();
        console.log(`Employer registered: ${newEmployer}`);
        console.log(`Generated verification code for ${organization_email}: ${verificationCode}`);

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newEmployer.organization_email,
            subject: 'Verify Your Email',
            text: `Please verify your email by using this code: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending verification email' });
            }
            res.status(201).json({ message: 'Employer registered successfully. Please check your email for verification code.' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering employer' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body; 

    try {
        console.log(`Verification request received for email: ${email}`);
        
        const employer = await Employer.findOne({ organization_email: email });
        console.log(`Employer from database: ${employer}`);

        if (!employer) {
            return res.status(400).json({ message: 'Employer not found' });
        }

        console.log(`Stored verification code: ${employer.verificationCode}`);
        console.log(`Entered verification code: ${verificationCode}`);

        if (employer.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        employer.isVerified = true;
        employer.verificationCode = undefined; 
        await employer.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Error verifying email' });
    }
};

exports.loginEmployer = async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password)
    try {
        const employer = await Employer.findOne({ organization_email: email });
        if (!employer) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
  
        const token = jwt.sign({ employerId: employer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token, userType: employer.userType });
    } catch (error) {
        console.error('Error logging in employer:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
