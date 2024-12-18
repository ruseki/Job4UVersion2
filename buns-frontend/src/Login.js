import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './universal.css'; 
import './login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email format is wrong.');
      return;
    }

    try {
      setLoading(true);
      const loginEndpoint = 'http://localhost:5000/api/auth/login';

      const response = await axios.post(loginEndpoint, { email, password });
      
      if (response.data) {
        const { token, userType, message, skills, health_conditions } = response.data;

        if (message === 'Email not verified') {
          navigate('/verify-email', { state: { email, userType } });
        } else if (token) {
          localStorage.setItem('token', token); 

          if (userType === 'user') {
            if (skills && skills.length > 0 && health_conditions && health_conditions.length > 0) {
              navigate('/dashboard'); // Redirect to dashboard if skills and health conditions exist
            } else {
              if (!skills || skills.length === 0) {
                navigate('/skills-questions'); // Redirect to skills questions if skills do not exist
              } else if (!health_conditions || health_conditions.length === 0) {
                navigate('/health-question'); // Redirect to health question if health conditions do not exist
              }
            }
          } else if (userType === 'employer') {
            navigate('/employer-dashboard'); 
          }
        } else {
          alert('Error logging in. Please check your credentials and try again.');
        }
      } else {
        alert('Error logging in. Please check your credentials and try again.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert('Invalid credentials. Please try again.');
        } else if (error.response.status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert('An unexpected error occurred.');
        }
      } else if (error.request) {
        alert('No response from server. Please check your network connection.');
      } else {
        alert('Error setting up the request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="Login_Job4ULogo"></div> {/* I moved this inside the form */}
        <h1 className="login-title">SIGN IN</h1>
        <p className="label_email">EMAIL</p>
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
            required
            className="email-input"
          />
        </div>
        <p className="label_password">PASSWORD</p>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=""
            required
          />
        </div>
        <div className="input-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
          <a href="/forgot-password" className="ForgotPassword">
            Forgot Password?
          </a>
        </div>
        <button type="submit" className='Sign-In-Button' disabled={loading}>
          {loading ? 'Logging in...' : 'SIGN IN'}
        </button>
        <div className="register-link">
          <p className="text_donthaveanaccount">Don't have an account? <a href="/register" className="Reglink">REGISTER</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
