import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './universal.css'; 
import { getToken } from './utils/auth';

const skillOptions = [
  "Java",
  "JavaScript",
  "Python",
  "SQL",
  "HTML",
  "CSS",
  "React",
  "Node.js",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "PHP",
  "TypeScript",
  "Angular",
  "Vue",
  "Django",
  "Spring",
  "Flask",
  "Laravel",
  "Bootstrap",
  "Sass",
  "Less",
  "jQuery",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Oracle",
  "Firebase",
  "AWS",
  "Azure",
  "Google Cloud",
  "IBM Cloud",
  "Oracle Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Travis CI",
  "CircleCI",
  "Terraform",
  "Ansible",
  "Puppet",
  "Chef",
  "Linux",
  "Unix",
  "Windows",
  "macOS",
  "Android",
  "iOS",
  "WordPress",
  "Drupal",
  "Magento",
  "Shopify",
  "Salesforce",
  "Tableau",
  "Power BI",
  "MATLAB",
  "R",
  "Scala",
  "Perl",
  "Rust",
  "Elixir",
  "F#",
  "Haskell",
  "Clojure",
  "GraphQL",
  "RESTful APIs",
  "SOAP",
  "WebSocket",
  "HTML5",
  "CSS3",
  "Svelte",
  "Next.js",
  "Nuxt.js",
  "React Native",
  "Flutter",
  "Xamarin",
  "Unity",
  "Unreal Engine",
  "TensorFlow",
  "Keras",
  "PyTorch",
  "scikit-learn",
  "OpenCV",
  "NLTK",
  "Apache Spark",
  "Hadoop",
  "Kafka",
  "RabbitMQ",
  "Elasticsearch",
  "Solr",
  "Kibana",
  "Prometheus",
  "Grafana",
  "Nagios",
  "Splunk",
  "Tableau",
  "PowerBI"
];

const SkillsQuestions = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleNextClick = async () => {
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill.");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("You must be logged in to save skills.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/skills/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills: selectedSkills }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Skills saved successfully!");
        navigate("/health-question");
      } else {
        alert(result.message || "Error saving skills.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error saving your skills.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h3>Select Your Skills</h3>
      <div className="universal-list">
        {skillOptions.map((skill) => (
          <button
            key={skill}
            className={`universal-item ${selectedSkills.includes(skill) ? 'selected' : ''}`}
            onClick={() => handleSkillToggle(skill)}
          >
            {skill}
          </button>
        ))}
      </div>
      <div className="actions">
        <button onClick={handleNextClick} disabled={loading} className="skills-universal-button">
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default SkillsQuestions;
