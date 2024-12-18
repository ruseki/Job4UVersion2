import React from 'react';
import { MapPin } from 'lucide-react';

const EmployerRegisterPage2 = ({ formData, onChange, onLinkChange, handleSubmit, handleBack, errorMessages }) => {
    const { primary_contact_name, primary_contact_position, headquarters_address, branch_company_address, social_media_links } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Capitalize first character of each word
        const newValue = value.replace(/\b\w/g, char => char.toUpperCase()).replace(/\s{2,}/g, ' ');

        // Remove trailing spaces
        const trimmedValue = newValue.trim();

        onChange({ target: { name, value: trimmedValue } });
    };

    const handleAlphaChange = (e) => {
        const { name, value } = e.target;

        // Only allow letters and periods, capitalize first character of each word
        const newValue = value.replace(/[^a-zA-Z.\s]/g, '').replace(/\b\w/g, char => char.toUpperCase()).replace(/\s{2,}/g, ' ');

        // Remove trailing spaces
        const trimmedValue = newValue.trim();

        onChange({ target: { name, value: trimmedValue } });
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Employer Registration</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Primary Contact Person Name</label>
                    <input type="text" name="primary_contact_name" value={primary_contact_name} onChange={handleAlphaChange} required />
                </div>
                <div className="input-group">
                    <label>Position</label>
                    <input type="text" name="primary_contact_position" value={primary_contact_position} onChange={handleAlphaChange} required />
                </div>
                <div className="input-group">
                    <label>Headquarter's Address</label>
                    <MapPin className="input-icon" />
                    <input type="text" name="headquarters_address" value={headquarters_address} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Branch Company Address</label>
                    <MapPin className="input-icon" />
                    <input type="text" name="branch_company_address" value={branch_company_address} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Social Media Link 1</label>
                    <input type="text" name="social_media_link_1" value={social_media_links[0]?.link || ''} onChange={(e) => onLinkChange(e, 0, 'link')} />
                </div>
                <div className="input-group">
                    <label>Social Media Link 2</label>
                    <input type="text" name="social_media_link_2" value={social_media_links[1]?.link || ''} onChange={(e) => onLinkChange(e, 1, 'link')} />
                </div>
                <div className="input-group">
                    <label>Social Media Link 3</label>
                    <input type="text" name="social_media_link_3" value={social_media_links[2]?.link || ''} onChange={(e) => onLinkChange(e, 2, 'link')} />
                </div>
                <button type="button" onClick={handleBack} className="back-button">
                    Back
                </button>
                <button type="submit" className="sign-up-button">SIGN UP</button>
            </form>
        </div>
    );
};

export default EmployerRegisterPage2;
