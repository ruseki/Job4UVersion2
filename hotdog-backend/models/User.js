const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    middle_name: {
        type: String,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    plain_text_password: {
        type: String,
        required: true,
    },
    skills: { 
        type: [String], 
    },
    health_conditions: { 
        type: [String], 
    },
    verificationCode: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        default: 'user',
    },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hash = await bcrypt.hash(this.password, 8);
        this.password = hash;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
