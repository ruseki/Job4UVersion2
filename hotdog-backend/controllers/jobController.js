const Job = require('../models/Job');
const Employer = require('../models/Employer');

exports.createJob = async (req, res) => {
    try {
        const employer = await Employer.findById(req.user.employerId);
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        const newJob = new Job({
            ...req.body,
            createdBy: req.user.employerId,
            createdByOrganization: employer.organization_name,
            createdByEmployerName: employer.primary_contact_name
        });

        await newJob.save();
        res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
        console.error('Server error:', error);  
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.employerId }).populate('createdBy', 'organization_name organization_email');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
