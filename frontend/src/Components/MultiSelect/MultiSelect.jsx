import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.scss'; // Make sure the SCSS file is in the same directory
import { CiCircleInfo } from "react-icons/ci";

const MultiSelect = ({ className, options, tooltips, onChange, customFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
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

    const filtered = options.filter(option =>
                      option?.toLowerCase().includes(filter.toLowerCase())
                    ).filter(option =>
                      !selectedItems.includes(option));


    setFilteredOptions(customFilter ? customFilter(filtered, selectedItems) : filtered);
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
    if (wrapperRef.current && (!wrapperRef.current.contains(event.target) && !inputRef.current.contains(event.target))) {
      setIsOpen(false); // Close the dropdown
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  const handleOptionClick = (option) => {
    const newItems = [...selectedItems, option]
    setSelectedItems(newItems);
    setIsOpen(false);
    if(onChange){
      onChange(newItems);
    }
    setFilter('');
  };

  return (
    <div className={`multi-select ${className}`} >
      <div className="select-display" onClick={toggleDropdown}>
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? filter : ""}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Select an option"
          readOnly={!isOpen}
          className="select-input"
        />
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {selectedItems.length > 0 ? <div className={`selected-items ${isOpen ? "delete-bottom-border" : "add-bottom-border"}`}>
        {selectedItems.map((item) => (
          <div key={item} className="selected-item">
            {item}
            <button onClick={() => handleRemoveItem(item)} className="remove-button">&times;</button>
          </div>
        ))} 
      </div> : null}
      {isOpen && (
        <ul className={`select-options ${selectedItems.length > 0 ? "delete-top-border" : "add-top-border"}`} ref={wrapperRef}>
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

export default MultiSelect;