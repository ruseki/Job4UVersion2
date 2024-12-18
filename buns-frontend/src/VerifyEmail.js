import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Key } from 'lucide-react'; 

const VerifyEmail = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(3);  // 3-second timer
    const navigate = useNavigate();
    const location = useLocation();

    const { email, userType } = location.state; 

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        }
    }, [timer]);

    const onChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const getEndpoint = (type) => {
        switch (type) {
            case 'user':
                return 'http://localhost:5000/api/auth';
            case 'employer':
                return 'http://localhost:5000/api/employer';
            case 'admin':
                return 'http://localhost:5000/api/admin'; // placeholder lamang
            default:
                return 'http://localhost:5000/api/auth';
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = `${getEndpoint(userType)}/verify-email`;
            const payload = { email, verificationCode };
            const res = await axios.post(endpoint, payload);
            console.log(res.data);
            setMessage(res.data.message);
            if (res.data.message === 'Email verified successfully') {
                navigate('/login'); 
            }
        } catch (error) {
            console.error(error);
            setMessage('Invalid verification code.'); /*temporary lang huhu*/
        }
    };

    const resendCode = async () => {
        if (timer === 0) {
            try {
                const endpoint = `${getEndpoint(userType)}/resend-verification-code`;
                const payload = { email };
                const res = await axios.post(endpoint, payload);
                console.log(res.data);
                setMessage(res.data.message);
                setTimer(3);  // Reset timer
            } catch (error) {
                console.error(error);
                setMessage('Error resending verification code');
            }
        }
    };

    return (
        <div className="verify-container">
            <h2 className="verify-title">Email Verification</h2>
            <form className="verify-form" onSubmit={onSubmit}>
                <div className="input-group">
                    <Mail className="input-icon" />
                    <input type="text" value={email} disabled />
                </div>
                <div className="input-group">
                    <Key className="input-icon" />
                    <input type="text" name="verificationCode" value={verificationCode} onChange={onChange} placeholder="Verification Code" required />
                </div>
                <button type="submit">Verify</button>
            </form>
            <div className="resend-container">
                <p>Did not get code? <span className="resend-link" onClick={resendCode} style={{ cursor: timer === 0 ? 'pointer' : 'not-allowed', color: timer === 0 ? 'blue' : 'gray' }}>
                    {timer === 0 ? 'Resend' : `Resend (${timer}s)`}
                </span></p>
            </div>
            <button onClick={() => navigate('/login')} className="verifyemailbackbutton">I'll do it later</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default VerifyEmail;
