import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import './universal.css';
import './jobform.css';
import './dh2.css';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [employerName, setEmployerName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchEmployerName = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employer', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        console.log('Fetched employer data:', data);
        setEmployerName(data.organization_name);
      } catch (error) {
        console.error('Error fetching employer name:', error);
      }
    };

    fetchJobs();
    fetchEmployerName();
  }, []); 

  const handleCreateJob = () => {
    navigate('/create-job-1');
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <a href="/employer-dashboard" className="navbar-item">DASHBOARD</a>
          <a href="/analytics" className="navbar-item">ANALYTICS</a>
          <a href="/settings" className="navbar-item">SETTINGS</a>
          <a href="/login" className="navbar-item">SIGN OUT</a>
        </div>
      </div>
      
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        &#9776; 
      </button>
      <nav className="navbar">
        <div className="navbar-logo"></div>
        <div className="navbar-menu">
          <a href="/employer-dashboard" className="navbar-item active">DASHBOARD</a>
          <a href="/analytics" className="navbar-item">ANALYTICS</a>
          <a href="/settings" className="navbar-item">SETTINGS</a>
          <a href="/login" className="navbar-item sign-out-button">SIGN OUT</a>
        </div>
        <div className="profile-section">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-button">
            <User size={24} />
          </button>
          <div className={`profile-dropdown ${isProfileOpen ? 'open' : ''}`}>
            <p>Name: {employerName}</p>
            <a href="/profile" className="profile-link">View Profile</a>
            <a href="/login" className="profile-link">Sign Out</a>
          </div>
        </div>
      </nav>
      <div className="super-rounded-container">
        <div className="dashboard-logo">
          <h1 className="Org_Name">{employerName}</h1>
        </div>
        <button className="post-job-btn" onClick={handleCreateJob}>
          <Search size={20} className="search-icon" />
          <span>Looking for an Employee?</span>
        </button>
        <div className="job-cards-container">
          {jobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-card-title">{job.title}</div>
              <div className="job-card-description">
                {job.description}
              </div>
              <div className="job-card-details">
                <p>Salary Range: ₱{formatNumberWithCommas(job.salaryRange.minSalary)} - ₱{formatNumberWithCommas(job.salaryRange.maxSalary)}</p>
                <p>Positions: {job.numberOfPositions}/{job.numberOfPositions}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
