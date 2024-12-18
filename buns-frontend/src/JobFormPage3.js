import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './universal.css';
import './jobform.css';        // HOY KIER ANO GINAGAWA MO //san?//

const JobFormPage3 = () => {
  const [jobRequirements, setJobRequirements] = useState([]);
  const [employmentTerms, setEmploymentTerms] = useState([]);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [benefits, setBenefits] = useState('');
  const [applicationProcess, setApplicationProcess] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [otherJobRequirements, setOtherJobRequirements] = useState('');
  const [otherEmploymentTerms, setOtherEmploymentTerms] = useState('');
  const [minSalaryError, setMinSalaryError] = useState(false);
  const [maxSalaryError, setMaxSalaryError] = useState(false);
  const [salaryComparisonError, setSalaryComparisonError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || {};
    if (!jobDetails.positions) {
      alert('Number of positions is missing from JobFormPage1.');
      navigate('/create-job-1');
    }
  }, [navigate]);

  const toggleOption = (option, setOption, currentOptions) => {
    if (currentOptions.includes(option)) {
      setOption(currentOptions.filter(o => o !== option));
    } else {
      setOption([...currentOptions, option]);
    }
  };

  const handleMinSalaryChange = (e) => {
    const value = e.target.value;
    if (/^\d{1,9}$/.test(value) || value === '') {
      setMinSalary(value);
      const numValue = parseFloat(value);
      if (numValue < 10000 || numValue > 999999999) {
        setMinSalaryError(true);
      } else {
        setMinSalaryError(false);
      }
      if (maxSalary !== '' && numValue > parseFloat(maxSalary)) {
        setSalaryComparisonError(true);
      } else {
        setSalaryComparisonError(false);
      }
    }
  };

  const handleMaxSalaryChange = (e) => {
    const value = e.target.value;
    if (/^\d{1,9}$/.test(value) || value === '') {
      setMaxSalary(value);
      const numValue = parseFloat(value);
      if (numValue < 10000 || numValue > 999999999) {
        setMaxSalaryError(true);
      } else {
        setMaxSalaryError(false);
      }
      if (minSalary !== '' && parseFloat(minSalary) > numValue) {
        setSalaryComparisonError(true);
      } else {
        setSalaryComparisonError(false);
      }
    }
  };

  const handleInputChange = (e, setInput) => {
    let value = e.target.value;
    value = value.replace(/^\s+/, ''); // Remove leading spaces
    value = value.replace(/\s\s+/g, ' '); // Replace multiple spaces with a single space
    setInput(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(minSalary) > parseFloat(maxSalary)) {
      alert('Minimum salary must not be greater than maximum salary.');
      return;
    }
    if (parseFloat(minSalary) < 10000) {
      alert('Insufficient minimum salary. It should be at least 10,000.');
      return;
    }

    try {
      const jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || {};
      const updatedJobDetails = {
        ...jobDetails,
        jobRequirements: [...jobRequirements, otherJobRequirements].filter(Boolean),
        employmentTerms: [...employmentTerms, otherEmploymentTerms].filter(Boolean),
        salaryRange: { minSalary, maxSalary },
        benefits,
        applicationProcess,
        additionalDetails,
      };
      // Ensure numberOfPositions is included
      updatedJobDetails.numberOfPositions = jobDetails.positions;
      console.log('Data being sent:', updatedJobDetails); // Log the data being sent

      localStorage.setItem('jobDetails', JSON.stringify(updatedJobDetails));
      const response = await fetch('http://localhost:5000/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedJobDetails),
      });
      if (response.ok) {
        alert('Job posted successfully!');
        navigate('/employer-dashboard');
      } else {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        alert(`Error posting job: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error creating job');
    }
  };

  const handleBack = () => {
    navigate('/create-job-2');
  };

  return (
    <div className="form-container">
      <h2 className="form-title">JOB OFFER DETAILS</h2>
      <form className="job-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Job Requirements</label>
          <div className="skills-container">
            {['Bachelor\'s Degree', 'Master\'s Degree', 'PhD', '3+ years experience', '5+ years experience'].map(req => (
              <button
                key={req}
                type="button"
                className={jobRequirements.includes(req) ? 'skill-button selected' : 'skill-button'}
                onClick={() => toggleOption(req, setJobRequirements, jobRequirements)}
              >
                {req}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Others:"
            value={otherJobRequirements}
            onChange={(e) => handleInputChange(e, setOtherJobRequirements)}
          />
        </div>
        <div className="input-group">
          <label>Employment Terms</label>
          <div className="skills-container">
            {['Full-time', 'Part-time', 'Contract', 'Internship'].map(term => (
              <button
                key={term}
                type="button"
                className={employmentTerms.includes(term) ? 'skill-button selected' : 'skill-button'}
                onClick={() => toggleOption(term, setEmploymentTerms, employmentTerms)}
              >
                {term}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Others:"
            value={otherEmploymentTerms}
            onChange={(e) => handleInputChange(e, setOtherEmploymentTerms)}
          />
        </div>
        <div className="input-group">
          <label>Salary Range</label>
          <div className="salary-container">
            <input
              type="text"
              placeholder="Min Salary (PHP)"
              value={minSalary}
              onChange={handleMinSalaryChange}
              required
            />
            {minSalaryError && <span className="error-message">Insufficient salary. Must be at least 10,000.</span>}
            {salaryComparisonError && <span className="error-message">Minimum salary should not be higher than the maximum.</span>}
            <input
              type="text"
              placeholder="Max Salary (PHP)"
              value={maxSalary}
              onChange={handleMaxSalaryChange}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label>Benefits</label>
          <textarea
            value={benefits}
            onChange={(e) => handleInputChange(e, setBenefits)}
            placeholder="(optional)"
          />
        </div>
        <div className="input-group">
          <label>Application Process</label>
          <textarea
            value={applicationProcess}
            onChange={(e) => handleInputChange(e, setApplicationProcess)}
            placeholder="(mandatory)"
            required
          />
        </div>
        <div className="input-group">
          <label>Additional Details</label>
          <textarea
            value={additionalDetails}
            onChange={(e) => handleInputChange(e, setAdditionalDetails)}
            placeholder="(optional)"
          />
        </div>
        <div className="button-group">
          <button className="job-form-buttons" type="button" onClick={handleBack}>Back</button>
          <button 
            type="submit" 
            disabled={
              minSalary === '' || 
              maxSalary === '' || 
              applicationProcess === '' || 
              minSalaryError || 
              maxSalaryError || 
              salaryComparisonError
            }
          >Submit</button>
        </div>
      </form>
    </div>
  );
};

export default JobFormPage3;
