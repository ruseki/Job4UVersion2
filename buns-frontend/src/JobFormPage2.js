import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './universal.css';
import './jobform.css';

const JobFormPage2 = () => {
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [cloudPlatforms, setCloudPlatforms] = useState([]);
  const [devOps, setDevOps] = useState([]);
  const [otherProgrammingLanguages, setOtherProgrammingLanguages] = useState('');
  const [otherFrameworks, setOtherFrameworks] = useState('');
  const [otherDatabases, setOtherDatabases] = useState('');
  const [otherCloudPlatforms, setOtherCloudPlatforms] = useState('');
  const [otherDevOps, setOtherDevOps] = useState('');
  const [otherSkills, setOtherSkills] = useState('');
  const navigate = useNavigate();

  const toggleSkill = (skill, setSkill, currentSkills) => {
    if (currentSkills.includes(skill)) {
      setSkill(currentSkills.filter(s => s !== skill));
    } else {
      setSkill([...currentSkills, skill]);
    }
  };

  const handleInputChange = (e, setInput) => {
    let value = e.target.value;
    value = value.replace(/^\s+/, ''); // Remove leading spaces
    value = value.replace(/\s\s+/g, ' '); // Replace multiple spaces with a single space
    setInput(value);
  };

  const handleNext = () => {
    const jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || {};
    const updatedJobDetails = {
      ...jobDetails,
      requiredSkills: {
        programmingLanguages,
        frameworks,
        databases,
        cloudPlatforms,
        devOps,
        others: {
          otherProgrammingLanguages,
          otherFrameworks,
          otherDatabases,
          otherCloudPlatforms,
          otherDevOps,
          otherSkills
        }
      }
    };
    localStorage.setItem('jobDetails', JSON.stringify(updatedJobDetails));
    navigate('/create-job-3');
  };

  const handleBack = () => {
    navigate('/create-job-1');
  };

  return (
    <div className="form-container">
      <h2 className="form-title">REQUIRED SKILLS</h2>
      <form className="job-form">
      <label>Programming Languages</label>
        <div className="input-group">
          <div className="skills-container">
            {['JavaScript', 'C++', 'Python', 'Go', 'Java'].map(lang => (
              <button
                key={lang}
                type="button"
                className={programmingLanguages.includes(lang) ? 'skill-button selected' : 'skill-button'}
                onClick={() => toggleSkill(lang, setProgrammingLanguages, programmingLanguages)}
              >
                {lang}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="(optional)"
            className="optional-input"
            value={otherProgrammingLanguages}
            onChange={(e) => handleInputChange(e, setOtherProgrammingLanguages)}
          />
        </div>
        <label>Frameworks</label>
        <div className="input-group">
          <div className="skills-container">
            {['React', 'Angular', 'Vue', 'Django', 'Spring'].map(fw => (
              <button
                key={fw}
                type="button"
                className={frameworks.includes(fw) ? 'skill-button selected' : 'skill-button'}
                onClick={() => toggleSkill(fw, setFrameworks, frameworks)}
              >
                {fw}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="(optional)"
            className="optional-input"
            value={otherFrameworks}
            onChange={(e) => handleInputChange(e, setOtherFrameworks)}
          />
        </div>
        <label>Database Management</label>
        <div className="input-group">
          <div className="skills-container">
            {['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle'].map(db => (
              <button
                key={db}
                type="button"
                className={databases.includes(db) ? 'skill-button selected' : 'skill-button'}
                onClick={() => toggleSkill(db, setDatabases, databases)}
              >
                {db}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="(optional)"
            className="optional-input"
            value={otherDatabases}
            onChange={(e) => handleInputChange(e, setOtherDatabases)}
          />
        </div>
        <label>Cloud Platforms</label>
        <div className="input-group">
          <div className="skills-container">
            {['AWS', 'Azure', 'Google Cloud', 'IBM Cloud', 'Oracle Cloud'].map(cp => (
              <button
                key={cp}
                type="button"
                className={cloudPlatforms.includes(cp) ? 'skill-button selected' : 'skill-button'}
                onClick={() => toggleSkill(cp, setCloudPlatforms, cloudPlatforms)}
              >
                {cp}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="(optional)"
            className="optional-input"
            value={otherCloudPlatforms}
            onChange={(e) => handleInputChange(e, setOtherCloudPlatforms)}
          />
        </div>
        <label>DevOps</label>
        <div className="input-group">
          <div className="skills-container">
            {['Docker', 'Kubernetes', 'Jenkins', 'Travis CI', 'CircleCI'].map(dev => (
              <button
                key={dev}
                type="button"
                className={devOps.includes(dev) ? 'skill-button selected' : 'skill-button'}
                onClick={() => toggleSkill(dev, setDevOps, devOps)}
              >
                {dev}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="(optional)"
            className="optional-input"
            value={otherDevOps}
            onChange={(e) => handleInputChange(e, setOtherDevOps)}
          />
        </div>
        <div className="input-group">
          <label>Other Skills</label>
          <input
            type="text"
            placeholder="(optional)"
            value={otherSkills}
            onChange={(e) => handleInputChange(e, setOtherSkills)}
          />
        </div>
        <div className="button-group-vertical">
          <button type="button" onClick={handleBack} className="back_button">Back</button>
          <button type="button" onClick={handleNext} className="next_button">Next</button>
        </div>
      </form>
    </div>
  );
};

export default JobFormPage2;
