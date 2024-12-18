// src/Landing_Page/Landing_Page.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing_page.css';
import ModelCanvas from './3DModel';

const LandingPage = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleJoinUs = () => {
    setClicked(true);
    navigate('/register');
  };

  const handleSignIn = () => {
    setClicked(true);
    navigate('/login')
  }

  return (
    <>
      <nav className="LP_navbar">
        <div className="LP_navbar-menu">
           <a href="/" className="LP_navbar-item active">ABOUT US</a>
          <a href="/" className="LP_navbar-item">DASHBOARD</a>
          <a href="/employer-dashboard" className="LP_navbar-item">BLOGS</a>
          <a href="/analytics" className="LP_navbar-item">CONTACT US</a>
          <a href="/settings" className="LP_navbar-item">SUPPORT US</a>
          <button className={`sign-in-button ${clicked ? 'clicked' : ''}`}
          onClick={handleSignIn}>SIGN IN</button>
          
        </div>
      </nav>

      <div className="landing-container">
        <div className="logo-wrapper">
          <ModelCanvas />
        </div>
        <div className="landing-text">
          <h1>Need help finding a job?</h1>
          <p>
            We connect the strings between talented IT professionals and forward-thinking employers. With a streamlined platform tailored for the IT industry, finding job opportunities, networking, and growing your career has never been easier.
          </p>
          <button 
            className={`join-us-button ${clicked ? 'clicked' : ''}`} 
            onClick={handleJoinUs}
          >
            Join Us Now
          </button>
        </div>
      </div>
      
      <div className="first_additional-content">
        <div className="first_additional-div1">
          <h4>Connect with top IT employers and expand your career opportunities. Access expert career advice, interview tips, and resume building tools.</h4>
        </div>
        <div className="first_additional-div2">
        </div>
      </div>

      <div className="second_additional-content">
        <div className="second_additional-div1">
        </div>
        <div className="second_additional-div2">
        <h4>Our platform focuses specifically on tech roles to match you with employers who understand the IT industry.</h4>
          <h4>Efficient & Easy – With a simple, user-friendly interface, find your next job in no time.</h4>
          <h4>Exclusive Opportunities – Get access to job listings and employer insights you won’t find anywhere else.</h4>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
