require('dotenv').config();  // Load .env file

const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
    }
});

/* i did create this on nodemailer for reset password -derek*/
var mailOptions = {
    from: process.env.EMAIL_USER,
    to: User.email ,
    subject: 'Resetting your password',
    text: `http://localhost:3000/api/ForgotPassword/${user.id}/${token}`
  };
  
  transporter.sendMail(mailOptions, function(error, info) { 
    if (error) {
      console.log(error);
    } else {
      return res.send({Status: "Success"})
    }
});


exports.generateOTP = () => {
    let verification = '';
    for (let i = 0; i < 4; i++) {  
        const randomValue = Math.round(Math.random() * 9);  
        verification = verification + randomValue;
    }
    return verification;  
};


exports.sendOTPEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,  
        to: toEmail,                  
        subject: 'Password Reset Request',
        text: `Your OTP for password reset is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email: ', error);
        return false;
    }
};

