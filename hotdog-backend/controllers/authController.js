const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Employer = require('../models/Employer');
const sendEmail = require('../utils/email');
const ResetToken = require('../models/tokens/reset_token');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const registerUser = async (req, res) => {
    const { first_name, middle_name, last_name, email, password, confirm_password } = req.body;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: "Password and confirm password do not match." });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new User({
            first_name,
            middle_name,
            last_name,
            email,
            password,
            plain_text_password: password, // temporary lamang
            userType: 'user'  
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        console.log('Hashed password:', newUser.password);

        const verificationCode = crypto.randomBytes(16).toString('hex');
        newUser.verificationCode = verificationCode;
        console.log(`Generated verification code for ${email}: ${verificationCode}`);

        await newUser.save();
        console.log(`Saved user: ${newUser}`);

        await sendEmail(email, 'Email Verification', `Please use the following code to verify your email: ${verificationCode}`);

        return res.status(200).json({ message: 'User registered successfully. A verification email has been sent.' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'reg Server error', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password });

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if the user exists in User collection
        const user = await User.findOne({ email });
        if (user) {
            if (password !== user.plain_text_password) {
                console.log('Invalid password for user:', email);
                return res.status(400).json({ message: "Invalid email or password." });
            }

            if (!user.isVerified) {
                console.log('User not verified:', email);
                // Send verification code to user's email
                const verificationCode = crypto.randomBytes(16).toString('hex');
                user.verificationCode = verificationCode;
                await user.save();
                await sendEmail(user.email, 'Email Verification', `Please use the following code to verify your email: ${verificationCode}`);
                
                return res.status(200).json({ 
                    message: "Email not verified", 
                    token: null, 
                    userType: user.userType,
                    redirect: '/verify-email'
                });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log('Login successful for user:', { email, token });
            return res.status(200).json({ message: "Login successful", token, userType: user.userType });
        }

        // Check if the user exists in Employer collection
        const employer = await Employer.findOne({ organization_email: email });
        if (employer) {
            const isMatch = await bcrypt.compare(password, employer.password);
            if (!isMatch) {
                console.log('Invalid password for employer:', email);
                return res.status(400).json({ message: "Invalid email or password." });
            }

            if (!employer.isVerified) {
                console.log('Employer not verified:', email);
                // Send verification code to employer's email
                const verificationCode = crypto.randomBytes(16).toString('hex');
                employer.verificationCode = verificationCode;
                await employer.save();
                await sendEmail(employer.organization_email, 'Email Verification', `Please use the following code to verify your email: ${verificationCode}`);

                return res.status(200).json({ 
                    message: "Email not verified", 
                    token: null, 
                    userType: employer.userType,
                    redirect: '/verify-email'
                });
            }

            const token = jwt.sign({ employerId: employer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log('Login successful for employer:', { email, token });
            return res.status(200).json({ message: "Login successful", token, userType: employer.userType });
        }

        // If email is not found in either collection
        return res.status(400).json({ message: "Invalid email or password." });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        console.log(`Verification request received for email: ${email}`);

        const user = await User.findOne({ email });
        console.log(`User from database: ${user}`);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        console.log(`Stored verification code: ${user.verificationCode}`);
        console.log(`Entered verification code: ${verificationCode}`);

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        user.isVerified = true;
        user.verificationCode = undefined; 
        await user.save();

        return res.status(200).json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
/* forgot password here.  Sorry jeania -derek*/
// ay bat? , eto diko kase nagawa eto -derek

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if the user exists in the User collection
        const user = await User.findOne({ email });
        if (user) {
            // Delete existing reset tokens for the user
            await ResetToken.deleteMany({ owner: user._id });

            const token = crypto.randomBytes(32).toString('hex');
            console.log('Generated token for user:', token);

            const resetToken = new ResetToken({
                owner: user._id,
                token: token  // Store the plain text token directly
            });

            await resetToken.save();
            console.log('Reset token saved for user:', resetToken);

            const resetLink = `http://localhost:3000/reset-password?token=${encodeURIComponent(token)}&id=${user._id}`;
            await sendEmail(user.email, `Password Reset Request`, `Please use the following link to reset your password: ${resetLink}`);

            return res.status(200).json({ message: "The password reset link is sent to your email. Please check your spam folder." });
        }

        // Check if the user exists in the Employer collection
        const employer = await Employer.findOne({ organization_email: email });
        if (employer) {
            // Delete existing reset tokens for the employer
            await ResetToken.deleteMany({ owner: employer._id });

            const token = crypto.randomBytes(32).toString('hex');
            console.log('Generated token for employer:', token);

            const resetToken = new ResetToken({
                owner: employer._id,
                token: token  // Store the plain text token directly
            });

            await resetToken.save();
            console.log('Reset token saved for employer:', resetToken);

            const resetLink = `http://localhost:3000/reset-password?token=${encodeURIComponent(token)}&id=${employer._id}`;
            await sendEmail(employer.organization_email, `Password Reset Request`, `Please use the following link to reset your password: ${resetLink}`);

            return res.status(200).json({ message: "The password reset link is sent to your email. Please check your spam folder." });
        }

        return res.status(404).json({ message: "Cannot find the user or employer." });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: "Error. Please come back later", error: error.message });
    }
};

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const verificationCode = crypto.randomBytes(16).toString('hex');
        user.verificationCode = verificationCode;
        await user.save();

        await sendEmail(user.email, 'Email Verification', `Please use the following code to verify your email: ${verificationCode}`);
        
        return res.status(200).json({ message: 'Verification code resent successfully' });
    } catch (error) {
        console.error('Error resending verification code:', error);
        res.status(500).json({ message: 'Error resending verification code' });
    }
};

module.exports = { resendVerificationCode };


const resetPassword = async (req, res) => {
    const { token, userId, newPassword } = req.body;
    try {
        console.log('Reset password attempt:', { token, userId });

        const resetToken = await ResetToken.findOne({ owner: userId });
        if (!resetToken) {
            console.log('No reset token found for user:', userId);
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        console.log('Stored token:', resetToken.token);

        if (resetToken.token !== token) {
            console.log('Invalid or expired password reset token:', { token, userId });
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        // Check if the user exists in the User collection
        const user = await User.findById(userId);
        if (user) {
            console.log('User found for password reset:', user);

            user.password = await bcrypt.hash(newPassword, 10);
            user.plain_text_password = newPassword;  // Update plain text password
            await user.save();
            console.log('Password updated for user:', user);

            await ResetToken.deleteOne({ owner: userId });
            console.log('Reset token deleted for user:', userId);

            return res.status(200).json({ message: "Password reset successful" });
        }

        // Check if the employer exists in the Employer collection
        const employer = await Employer.findById(userId);
        if (employer) {
            console.log('Employer found for password reset:', employer);

            employer.password = await bcrypt.hash(newPassword, 10);
            employer.plain_text_password = newPassword;  // Update plain text password
            await employer.save();
            console.log('Password updated for employer:', employer);

            await ResetToken.deleteOne({ owner: userId });
            console.log('Reset token deleted for employer:', userId);

            return res.status(200).json({ message: "Password reset successful" });
        }

        return res.status(404).json({ message: "Cannot find the user or employer." });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const saveSkills = async (req, res) => {
    console.log('saveSkills called');
    const { skills } = req.body;
    console.log('Skills received:', skills);

    const userId = req.user.userId;
    console.log('User ID from token:', userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);
        user.skills = skills;
        await user.save();
        console.log('User skills saved:', user.skills);

        return res.status(200).json({ message: 'Skills saved successfully' });
    } catch (error) {
        console.error('Error saving skills:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const saveHealthConditions = async (req, res) => {
    console.log('saveHealthConditions called');
    const { healthConditions } = req.body;
    console.log('Health conditions received:', healthConditions);

    const userId = req.user.userId; 
    console.log('User ID from token:', userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);
        user.health_conditions = healthConditions;
        await user.save();
        console.log('User health conditions saved:', user.health_conditions);

        return res.status(200).json({ message: 'Health conditions saved successfully' });
    } catch (error) {
        console.error('Error saving health conditions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const registerEmployer = async (req, res) => {
    const {
        organization_email,
        password,
        confirm_password,
        organization_name,
        business_type,
        primary_contact_name,
        primary_contact_position,
        contact_information,
        social_media_links,
        agree_terms
    } = req.body;

    if (!organization_email || !password || !confirm_password || !organization_name || !business_type || !primary_contact_name || !primary_contact_position || !contact_information || !agree_terms) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organization_email)) {
        return res.status(400).json({ message: "Incorrect email format." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Please choose a stronger password. Must consist of 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol." });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: "Password does not match." });
    }

    try {
        const existingEmployer = await Employer.findOne({ organization_email });
        if (existingEmployer) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployer = new Employer({
            organization_email,
            password: hashedPassword,
            plain_text_password: password,
            organization_name,
            business_type,
            primary_contact_name,
            primary_contact_position,
            contact_information,
            social_media_links,
            isVerified: false,
            verificationCode: crypto.randomBytes(16).toString('hex')
        });

        await newEmployer.save();

        // Send verification email
        await sendEmail(newEmployer.organization_email, 'Email Verification', `Please use the following code to verify your email: ${newEmployer.verificationCode}`);

        res.status(201).json({ message: "Employer registered successfully. Please verify your email.", userType: 'employer' });
    } catch (error) {
        console.error('Error registering employer:', error);
        res.status(500).json({ message: 'Error registering employer', error: error.message });
    }
};

module.exports = { login, registerUser, verifyEmail, saveSkills, saveHealthConditions, forgotPassword, resetPassword, resendVerificationCode, registerEmployer }; /* idadagdag ko ung ForgotPasword */
