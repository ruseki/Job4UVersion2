import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './universal.css';
import { getToken } from './utils/auth';

const healthOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Allergies",
  "Heart Disease",
  "Thyroid Disorder",
  "Chronic Pain",
  "Mental Health Issues",
  "Repetitive Strain Injuries (RSI)",
  "Chronic Back and Neck Pain",
  "Computer Vision Syndrome (Eye Strain)",
  "Obesity or Metabolic Syndrome",
  "Sleep Disorders",
  "Migraine or Chronic Headaches",
  "Anxiety Disorders",
  "Depression",
  "Burnout Syndrome",
  "Attention Deficit Hyperactivity Disorder (ADHD)",
  "Post-Traumatic Stress Disorder (PTSD)",
  "Chronic Fatigue Syndrome (CFS)",
  "Autoimmune Disorders (e.g., Rheumatoid Arthritis, Lupus)",
  "Multiple Sclerosis",
  "Workplace Allergies (e.g., dust, poor air quality)",
  "Hearing Problems (e.g., noise-induced hearing loss)",  
];

const HealthConditions = () => {
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConditionToggle = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const handleNextClick = async () => {
    if (selectedConditions.length === 0) {
      alert("Please select at least one health condition.");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("You must be logged in to save health conditions.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/healthConditions/health-conditions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ healthConditions: selectedConditions }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Health conditions saved successfully!");
        navigate("/dashboard");
      } else {
        alert(result.message || "Error saving health conditions.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error saving your health conditions.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/skills-questions"); 
  };

  return (
    <div className="container">
      <h4>Do you have any of the following health conditions below?</h4>
      <div className="universal-list">
        {healthOptions.map((condition) => (
          <button
            key={condition}
            className={`universal-item ${selectedConditions.includes(condition) ? 'selected' : ''}`}
            onClick={() => handleConditionToggle(condition)}
          >
            {condition}
          </button>
        ))}
      </div>
      <div className="actions">
        <button onClick={handleBackClick} className="universal-button">
          Back
        </button>
        <button onClick={handleNextClick} disabled={loading} className="universal-button">
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default HealthConditions; 
