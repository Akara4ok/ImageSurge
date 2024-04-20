import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.scss'; // Make sure the SCSS file is in the same directory
import { CiCircleInfo } from "react-icons/ci";

const CustomSelect = ({ className, options, tooltips, onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [filter, setFilter] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    setFilteredOptions(
      options.filter(option =>
        option?.toLowerCase().includes(filter.toLowerCase())
      )
    );
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, filter, options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFilter('');
    }
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false); // Close the dropdown
    }
  };

  const handleOptionClick = (option, index) => {
    setSelectedOption(option);
    setIsOpen(false);
    if(onOptionSelect){
      onOptionSelect(option, index);
    }
    setFilter('');
  };

  return (
    <div className={`custom-select ${className}`} ref={wrapperRef} >
      <div className="select-display" onClick={toggleDropdown}>
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? filter : selectedOption}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Select an option"
          readOnly={!isOpen}
          className="select-input"
        />
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <ul className="select-options">
          {filteredOptions.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option, index)}>
              {option}
              {tooltips ? <CiCircleInfo className="tooltip" size="20px"></CiCircleInfo> : null}
              {tooltips && tooltips[index] ? <span className="tooltiptext">{tooltips[index]}</span> : null}
            </li>
          ))}
          {filteredOptions.length === 0 && <li className="no-options">No options found</li>}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;