// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; /* tinanggal ko ung navigate, line 39 dinagdag ko rin. PLS wag nyo aalisin etong mga comment kase palatandaan ko*/
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import Login from './Login';
import SkillsQuestions from './SkillsQuestions';
import HealthQuestion from './HealthQuestion'; 
import HealthConditions from './HealthConditions';
import EmployerRegister from './EmployerRegister';
import Dashboard from './dh';
import EmployerDashboard from './dh2';
import JobFormPage1 from './JobFormPage1';
import JobFormPage2 from './JobFormPage2';
import JobFormPage3 from './JobFormPage3';
import LandingPage from './Landing_Page/Landing_Page'; 
import './universal.css';
import ForgotPassword from './ForgotPassword'; /* dinagdag ko rin eto*/
import ResetPassword from './ResetPassword';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/skills-questions" element={<SkillsQuestions />} />
                    <Route path="/health-question" element={<HealthQuestion />} />
                    <Route path="/health-conditions" element={<HealthConditions />} />
                    <Route path="/employer-register" element={<EmployerRegister />} />
                    <Route path="/dashboard" element={<Dashboard />} />  
                    <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                    <Route path="/create-job-1" element={<JobFormPage1 />} />
                    <Route path="/create-job-2" element={<JobFormPage2 />} />
                    <Route path="/create-job-3" element={<JobFormPage3 />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
