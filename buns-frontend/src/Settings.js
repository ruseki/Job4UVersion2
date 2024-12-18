import React, { useState } from "react";
import "./DropdownSettings.css";

const DropdownSettings = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="dropdown-container">
      {showDropdown && (
        <ul className="dropdown-menu">
          <li><a href="/profile">Profile</a></li>
          <li><a href="/account">Account</a></li>
          <li><a href="/security">Security</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      )}
    </div>
  );
};

export default DropdownSettings;
