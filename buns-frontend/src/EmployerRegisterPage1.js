import React from 'react';
import { Phone, PlusCircle } from 'lucide-react';

const EmployerRegisterPage1 = ({ formData, onChange, handleAddContact, additionalContacts, onContactChange, handleNext, onCheckChange, errorMessages }) => {
    if (!formData) {
        return null;
    }

    const { organization_email, organization_name, registered_business_name, business_type, password, confirm_password, contact_information, agree_terms, receive_updates } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Prevent consecutive spaces and ensure capitalization
        const newValue = value
            .replace(/\s{2,}/g, ' ') // Prevent consecutive spaces
            .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) // Capitalize first letter of each word
            .replace(/\s+$/, ''); // Remove trailing spaces

        onChange({ target: { name, value: newValue } });
    };

    return (
        <div className="employer-register-container">
            <h2 className="register-title">Employer Registration</h2>
            <form className="register-form" onSubmit={handleNext}>
                <div className="input-group">
                    <label>Organization Email</label>
                    <input type="email" name="organization_email" value={organization_email} onChange={onChange} required />
                    {errorMessages.organization_email && <p className="error-message">{errorMessages.organization_email}</p>}
                </div>
                <div className="input-group">
                    <label>Organization Name</label>
                    <input type="text" name="organization_name" value={organization_name} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Registered Business Name</label>
                    <input type="text" name="registered_business_name" value={registered_business_name} onChange={handleChange} />
                    <p className="note">If different from the Organization Name</p>
                </div>
                <div className="input-group">
                    <label>Business Type/Legal Entity</label>
                    <select name="business_type" value={business_type} onChange={onChange} required>
                        <option value="">Select Business Type/Legal Entity</option>
                        <option value="sole_proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="corporation">Corporation</option>
                        <option value="llc">Limited Liability Company (LLC)</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required />
                    {errorMessages.password && <p className="error-message">{errorMessages.password}</p>}
                </div>
                <div className="input-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" value={confirm_password} onChange={onChange} required />
                    {errorMessages.password && <p className="error-message">{errorMessages.password}</p>}
                </div>
                <div className="input-group">
                    <label>Contact Information</label>
                    <Phone className="input-icon" />
                    <input type="text" name="contact_information" value={contact_information} onChange={onChange} required />
                    {errorMessages.contact_information && <p className="error-message">{errorMessages.contact_information}</p>}
                </div>
                {additionalContacts.map((contact, index) => (
                    <div className="input-group" key={index}>
                        <label>Additional Contact Information</label>
                        <Phone className="input-icon" />
                        <input type="text" value={contact} onChange={(e) => onContactChange(e, index)} />
                    </div>
                ))}
                <button type="button" onClick={handleAddContact} className="add-button" disabled={additionalContacts.length >= 3}>
                    {additionalContacts.length >= 3 ? "You've reached the maximum limit" : "Add additional contact information"}
                </button>
                <div className="input-group checkbox-group">
                    <input type="checkbox" name="agree_terms" checked={agree_terms} onChange={onCheckChange} required />
                    <label>
                        <a href="/terms-of-use" className="terms-link">I agree with terms of use</a>
                    </label>
                    {errorMessages.terms && <p className="error-message">{errorMessages.terms}</p>}
                </div>
                <div className="input-group checkbox-group">
                    <input type="checkbox" name="receive_updates" checked={receive_updates} onChange={onCheckChange} />
                    <label>I want to receive future updates</label>
                </div>
                <button type="submit" className="next-button">Next</button>
            </form>
        </div>
    );
};

export default EmployerRegisterPage1;
