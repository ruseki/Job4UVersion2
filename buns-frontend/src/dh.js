import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './universal.css';
import './jobform.css';
import './dh2.css'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        console.log('Fetched jobs:', data);
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUserName(data.first_name + ' ' + data.last_name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchJobs();
    fetchUserName();
  }, []);

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-logo"></div>
        <div className="navbar-menu">
          <a href="/dashboard" className="navbar-item active">DASHBOARD</a>
          <a href="/analytics" className="navbar-item">ANALYTICS</a>
          <div className="dropdown-settings">
            <a href="#" className="navbar-item dropdown-toggle" onClick={toggleDropdown}>SETTINGS</a>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><a href="/profile">Profile</a></li>
                <li><a href="/account">Account Settings</a></li>
                <li><a href="/security">Security</a></li>
              </ul>
            )}
          </div>
          <a href="/login" className="navbar-item sign-out-button">SIGN OUT</a>
        </div>
      </nav>
      <div className="super-rounded-container">
        <div className="dashboard-logo">
          <h1 className="User_Name">{userName}</h1>
        </div>
        <div className="job-cards-container">
          {jobs.map(job => (
            <div key={job._id} className="job-card" onClick={() => handleJobSelect(job)}>
              <div className="job-card-title">{job.title}</div>
              <div className="job-card-description">
                {job.description}
              </div>
              <div className="job-card-details">
                <p>Organization: {job.createdBy.organization_name}</p>
                <p>Salary Range: ₱{formatNumberWithCommas(job.salaryRange.minSalary)} - ₱{formatNumberWithCommas(job.salaryRange.maxSalary)}</p>
                <p>Positions: {job.numberOfPositions}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedJob && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedJob.title}</h2>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Number of Positions:</strong> {selectedJob.numberOfPositions}</p>
            <p><strong>Programming Languages:</strong> {selectedJob.programmingLanguages.join(', ')}</p>
            <p><strong>Frameworks:</strong> {selectedJob.frameworks.join(', ')}</p>
            <p><strong>Databases:</strong> {selectedJob.databases.join(', ')}</p>
            <p><strong>Cloud Platforms:</strong> {selectedJob.cloudPlatforms.join(', ')}</p>
            <p><strong>DevOps Tools:</strong> {selectedJob.devOps.join(', ')}</p>
            <p><strong>Other Skills:</strong> {selectedJob.otherSkills.join(', ')}</p>
            <p><strong>Job Requirements:</strong> {selectedJob.jobRequirements.join(', ')}</p>
            <p><strong>Employment Terms:</strong> {selectedJob.employmentTerms.join(', ')}</p>
            <p><strong>Salary Range:</strong> ₱{formatNumberWithCommas(selectedJob.salaryRange.minSalary)} - ₱{formatNumberWithCommas(selectedJob.salaryRange.maxSalary)}</p>
            <p><strong>Benefits:</strong> {selectedJob.benefits}</p>
            <p><strong>Application Process:</strong> {selectedJob.applicationProcess}</p>
            <p><strong>Additional Details:</strong> {selectedJob.additionalDetails}</p>
            <p><strong>Created By:</strong> {selectedJob.createdByEmployerName} at {selectedJob.createdByOrganization}</p>
            <p><strong>Created At:</strong> {new Date(selectedJob.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
