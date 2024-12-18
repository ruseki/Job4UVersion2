import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmployerRegisterPage1 from './EmployerRegisterPage1';
import EmployerRegisterPage2 from './EmployerRegisterPage2';
import './universal.css';
import './employer-register.css';

const EmployerRegister = () => {
    const [formData, setFormData] = useState({
        organization_email: '',
        organization_name: '',
        registered_business_name: '',
        business_type: '',
        primary_contact_name: '',
        primary_contact_position: '',
        password: '',
        confirm_password: '',
        contact_information: '',
        headquarters_address: '',
        branch_company_address: '',
        social_media_links: [{ link: '' }, { link: '' }, { link: '' }], // Ensure links are initialized
        agree_terms: false,
        receive_updates: false,
    });

    const [additionalContacts, setAdditionalContacts] = useState(['']);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        organization_email: '',
        password: '',
        form: '',
        terms: '',
    });

    const navigate = useNavigate();

    const onChange = (e) => {
        const { name, value } = e.target;
        
        // Prevent consecutive spaces
        const newValue = value.replace(/\s{2,}/g, ' ');

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));

        // Clear errors dynamically if corrected
        if (name === 'organization_email' && errorMessages.organization_email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(newValue)) {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    organization_email: '',
                }));
            }
        }

        if ((name === 'password' || name === 'confirm_password') && errorMessages.password) {
            if (formData.password === formData.confirm_password) {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    password: '',
                }));
            }
        }
    };

    const onCheckChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

    const handleAddContact = () => {
        if (additionalContacts[additionalContacts.length - 1].trim() !== '') {
            setAdditionalContacts([...additionalContacts, '']);
        }
    };

    const onContactChange = (e, index) => {
        const newContacts = additionalContacts.slice();
        newContacts[index] = e.target.value.replace(/\s{2,}/g, ' ');
        setAdditionalContacts(newContacts);
    };

    const onLinkChange = (e, index, field) => {
        const newSocialMediaLinks = formData.social_media_links.slice();
        newSocialMediaLinks[index] = { ...newSocialMediaLinks[index], [field]: e.target.value.replace(/\s{2,}/g, ' ') };
        setFormData({ ...formData, social_media_links: newSocialMediaLinks });
    };

    const handleNext = (e) => {
        e.preventDefault();

        let errors = { ...errorMessages };

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.organization_email)) {
            errors.organization_email = 'Invalid email format.';
        } else {
            errors.organization_email = '';
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            errors.password =
                'Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.';
        } else if (formData.password !== formData.confirm_password) {
            errors.password = 'Passwords do not match.';
        } else {
            errors.password = '';
        }

        setErrorMessages(errors);

        if (errors.organization_email || errors.password) return;

        setPage(2);
    };

    const handleBack = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let errors = { ...errorMessages };

        // Validate again before submission
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.organization_email)) {
            errors.organization_email = 'Invalid email format.';
        } else {
            errors.organization_email = '';
        }

        if (!formData.agree_terms) {
            errors.terms = 'You must agree to the terms.';
        } else {
            errors.terms = '';
        }

        if (formData.contact_information.replace(/\s+/g, '').length < 5) {
            errors.contact_information = 'Contact Information must be at least 5 characters long (excluding spaces).';
        } else {
            errors.contact_information = '';
        }

        setErrorMessages(errors);

        if (errors.organization_email || errors.password || errors.terms || errors.contact_information) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/employer/register', {
                ...formData,
                additionalContacts,
            });

            if (res.data.message.includes('Employer registered successfully')) {
                navigate('/verify-email', {
                    state: { email: formData.organization_email, userType: 'employer' },
                });
            } else {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    form: 'Error registering employer.',
                }));
            }
        } catch (error) {
            console.error('Error registering employer:', error);
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                form: 'Error registering employer.',
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {page === 1 ? (
                <EmployerRegisterPage1
                    formData={formData}
                    onChange={onChange}
                    onCheckChange={onCheckChange}
                    handleAddContact={handleAddContact}
                    additionalContacts={additionalContacts}
                    onContactChange={onContactChange}
                    handleNext={handleNext}
                    errorMessages={errorMessages}
                />
            ) : (
                <EmployerRegisterPage2
                    formData={formData}
                    onChange={onChange}
                    onLinkChange={onLinkChange}
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    errorMessages={errorMessages}
                />
            )}

            {/* Pop-up error messages */}
            {Object.keys(errorMessages).map((key) =>
                errorMessages[key] ? (
                    <div key={key} className="popup-error">
                        {errorMessages[key]}
                    </div>
                ) : null
            )}
        </>
    );
};

export default EmployerRegister;
