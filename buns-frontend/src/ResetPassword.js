import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './universal.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /***const token = searchParams.get('token');
  const userId = searchParams.get('id');*/

  const token = decodeURIComponent(searchParams.get('token'));
const userId = searchParams.get('id');


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !userId) {
      alert('Invalid or expired reset link.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { token, userId, newPassword });

      if (response.data.message) {
        alert(response.data.message);
        navigate('/login');
      } else {
        alert('Error: Could not reset password. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h1 className="reset-password-title">Reset Password</h1>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          required
          className="password-input"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="reset-button"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
