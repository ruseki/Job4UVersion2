import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import './universal.css';
import './register.css'; 

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        email: '',
        password: '',
        form: ''
    });

    const { first_name, middle_name, last_name, email, password, confirm_password } = formData;

    const navigate = useNavigate();

    const capitalizeWords = (string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    }

    const onChange = e => {
        const { name, value } = e.target;

        if (name === "first_name" || name === "middle_name" || name === "last_name") {
            setFormData({ ...formData, [name]: capitalizeWords(value) });
        } else {
            setFormData({ ...formData, [name]: value });

            if (name === "email" && errorMessages.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    setErrorMessages({ ...errorMessages, email: '' });
                }
            }

            if ((name === "password" || name === "confirm_password") && errorMessages.password) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (passwordRegex.test(password)) {
                    if (password === confirm_password) {
                        setErrorMessages({ ...errorMessages, password: '' });
                    }
                }
            }
        }
    };

    const onSubmit = async e => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        let errors = { ...errorMessages };

        if (!emailRegex.test(email)) {
            errors.email = 'Incorrect email format';
        } else {
            errors.email = '';
        }

        if (!passwordRegex.test(password)) {
            errors.password = 'Please choose a stronger password. Must consist of 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol.';
        } else if (password !== confirm_password) {
            errors.password = 'Password does not match';
        } else {
            errors.password = '';
        }

        setErrorMessages(errors);

        // Only proceed if there are no errors
        if (errors.email || errors.password) {
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            console.log(res.data);
            if (res.data.message.includes('User registered successfully')) {
                navigate('/verify-email', { state: { email } });
            } else {
                setErrorMessages({ ...errorMessages, form: 'Error registering user' });
            }
        } catch (error) {
            console.error(error);
            setErrorMessages({ ...errorMessages, form: 'Error registering user' });
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">SIGN UP</h2>
            <form className="register-form" onSubmit={onSubmit}>
                <p className="label_first-name">First Name</p>
                <div className="input-group">
                    <User className="input-icon" />
                    <input 
                        type="text" 
                        name="first_name" 
                        value={first_name} 
                        onChange={onChange} 
                        placeholder="" 
                        required 
                    />
                </div>
                <p className="label_middle-name">Middle Name</p>
                <div className="input-group">
                    <User className="input-icon" />
                    <input 
                        type="text" 
                        name="middle_name" 
                        value={middle_name} 
                        onChange={onChange} 
                        placeholder="" 
                    />
                </div>
                <p className="label_last-name">Last Name</p>
                <div className="input-group">
                    <User className="input-icon" />
                    <input 
                        type="text" 
                        name="last_name" 
                        value={last_name} 
                        onChange={onChange} 
                        placeholder="" 
                        required 
                    />
                </div>
                <p className="label_email">Email</p>
                <div className="input-group">
                    <Mail className="input-icon" />
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={onChange} 
                        placeholder="" 
                        required 
                    />
                </div>
                {errorMessages.email && <p className="error-message">{errorMessages.email}</p>}
                <p className="label_password">Password</p>
                <div className="input-group">
                    <Lock className="input-icon" />
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={onChange} 
                        placeholder="" 
                        required 
                    />
                </div>
                <p className="label_confirm-password">Confirm Password</p>
                <div className="input-group">
                    <Lock className="input-icon" />
                    <input 
                        type="password" 
                        name="confirm_password" 
                        value={confirm_password} 
                        onChange={onChange} 
                        placeholder="" 
                        required 
                    />
                </div>
                {errorMessages.password && <p className="error-message">{errorMessages.password}</p>}
                <button type="submit" className="sign-up-button">SIGN UP</button>
                <div className="register-links">
                    <p className="inline-text">
                    ‎  ‎  ‎  ‎  ‎  ‎  ‎  ‎  ‎  ‎  ‎ ‎  ‎  ‎  ‎  ‎  ‎  Already have an account? <a href="/login" className="register-sign-in-button">SIGN IN</a>
                    </p>
                    <p>
                        <a href="/employer-register" className="company">Are you a company / business / organization looking for talents?</a>
                    </p>
                </div>
                {errorMessages.form && <p className="error-message">{errorMessages.form}</p>}
            </form>
        </div>
    );
};

export default Register;
