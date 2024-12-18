import React from 'react';
import { useNavigate } from 'react-router-dom';
import './universal.css'; 

const HealthQuestion = () => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    navigate('/health-conditions'); 
  };

  const handleNoClick = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="health-question-container">
      <h4>Do you have any health conditions?</h4>
      <div className="health-question-buttons">
        <button onClick={handleYesClick} className="universal-button">Yes</button>
        <button onClick={handleNoClick} className="universal-button">No</button>
      </div>
    </div>
  );
};

export default HealthQuestion;
