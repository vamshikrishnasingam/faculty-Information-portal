import React, { useState, useRef, useEffect } from 'react';
import './freehoursclient.css'

const DropdownWithCheckboxes = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const dropdownRef = useRef();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (optionValue) => {
    const isChecked = selectedOptions.includes(optionValue);
    if (isChecked) {
      setSelectedOptions(selectedOptions.filter((value) => value !== optionValue));
    } else {
      setSelectedOptions([...selectedOptions, optionValue]);
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={toggleDropdown}>
        Select Options
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {options.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownWithCheckboxes;
