const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    numberOfPositions: { type: Number, required: true },
    programmingLanguages: [String],
    frameworks: [String],
    databases: [String],
    cloudPlatforms: [String],
    devOps: [String],
    otherSkills: [String],
    jobRequirements: [{ type: String, required: true }], // Updated to expect an array of strings
    employmentTerms: [{ type: String, required: true }], // Updated to expect an array of strings
    salaryRange: {
        minSalary: { type: Number, required: true },
        maxSalary: { type: Number, required: true }
    },
    benefits: { type: String, required: true },
    applicationProcess: { type: String, required: true },
    additionalDetails: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
    createdByOrganization: { type: String, required: true },
    createdByEmployerName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
