const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmployerSchema = new mongoose.Schema({
    organization_email: {
        type: String,
        required: true,
        unique: true,
    },
    organization_name: {
        type: String,
        required: true,
    },
    registered_business_name: {
        type: String,
        default: ''
    },
    business_type: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    plain_text_password: {
        type: String,
        required: true,
    },
    contact_information: {
        type: String,
        required: true,
    },
    primary_contact_name: {
        type: String,
        required: true,
    },
    primary_contact_position: {
        type: String,
        required: true,
    },
    headquarters_address: {
        type: String,
        default: ''
    },
    branch_company_address: {
        type: String,
        default: ''
    },
    social_media_links: [
        {
            link: {
                type: String,
                default: ''
            }
        }
    ],
    verificationCode: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        default: 'employer',
    }
});

EmployerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('Employer', EmployerSchema);
