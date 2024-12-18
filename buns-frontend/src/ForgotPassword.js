import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './universal.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // State for success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');  // Clear any previous success message
    
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Email format is wrong.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      console.log('Response data:', response.data);

      if (response.status === 200) {  
        setSuccessMessage('Password reset link sent to your email.');
      } else {
        setErrorMessage('Error: Could not send reset link. Please try again.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      if (error.response && error.response.status === 404) {
        setErrorMessage('Email does not match any credentials on our system.');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <h1 className="forgot-password-title">Forgot Password</h1>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="email-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}  {/* Display error message */}
        {successMessage && <p className="success-message">{successMessage}</p>}  {/* Display success message */}
        <button 
          type="submit" 
          disabled={loading} 
          className="send-reset-button"
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
        <button onClick={handleBack} className="back-button">Back to Login</button>

      </form>
      

      
    </div>
    
  );
}
/*tanggalin ko ba muna like balik ko muna sa datI? WAG MO TANGGALIN COMMENT HAHAHAHA nagctrl Z kase ako  */
/*ayan ok  na , icocombine ko sana yung dalawa tama naman dba? */
export default ForgotPassword;
