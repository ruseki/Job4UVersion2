import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './universal.css';
import './jobform.css'; 

const JobFormPage1 = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [positions, setPositions] = useState(1); 
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/^\s+/, ''); 
    value = value.replace(/\s\s+/g, ' '); 

    if (/^[^\d]*$/.test(value)) { 
      setTitle(value);
      setTitleError(value.replace(/\s/g, '').length < 3);
    }
  };

  const handleDescriptionChange = (e) => {
    let value = e.target.value;
    value = value.replace(/^\s+/, ''); 
    value = value.replace(/\s\s+/g, ' '); 

    setDescription(value);
    setDescriptionError(value.replace(/\s/g, '').length < 50);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (title.replace(/\s/g, '').length < 3) {
      setTitleError(true);
      return;
    }
    if (description.replace(/\s/g, '').length < 50) {
      setDescriptionError(true);
      alert("Add more description");
      return;
    }

    const jobDetails = {
      title,
      description,
      positions
    };
    localStorage.setItem('jobDetails', JSON.stringify(jobDetails));
    navigate('/create-job-2');
  };

  const handleFocus = (e) => {
    e.target.value = e.target.value.trimStart();
  };

  return (
    <div className="form-container1">
      <h2 className="form-title">Create Job Listing</h2>
      <form className="job-form" onSubmit={handleNext}>
        <div className="input-group">
          <label>Job Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onFocus={handleFocus} 
            required
          />
          {titleError && <span className="error-message">Insufficient title</span>}
        </div>
        <div className="input-group">
          <label>Job Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            onFocus={handleFocus} 
            required
          />
          {descriptionError && <span className="error-message">Add more description</span>}
        </div>
        <div className="input-group">
          <label>Number of Positions Available</label>
          <input
            type="number"
            value={positions}
            onChange={(e) => setPositions(Math.min(999, Math.max(1, parseInt(e.target.value, 10))))}
            min="1"
            max="999"
            required
          />
        </div>
        <div className="button-group">
          <button className="job-form-buttons" type="button" onClick={() => navigate('/employer-dashboard')}>Back</button>
          <button className="job-form-buttons" type="submit" disabled={title.replace(/\s/g, '').length < 3 || description.replace(/\s/g, '').length < 50}>Next</button>
        </div>
      </form>
    </div>
  );
};

export default JobFormPage1;
