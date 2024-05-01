import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect2.scss'; // Make sure the SCSS file is in the same directory
import { CiCircleInfo } from "react-icons/ci";
import Button from '../Button/Button';
import CustomSelect from '../CustomSelect/CustomSelect';
import { processingCreator } from '../../utils/utils';

const MultiSelect2 = ({ className, options, onChange, customFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemsName, setSelectedItemsName] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [lastOptionParam1, setLastOptionParam1] = useState("");
  const [lastOptionParam2, setLastOptionParam2] = useState("");
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
                      !selectedItemsName.includes(option));

    setFilteredOptions(customFilter ? customFilter(filtered) : filtered);
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
      setLastOptionParam1('');
      setLastOptionParam2('');
    }
  };

  const handleRemoveItem = (item) => {
    const newItems = selectedItems.filter((i) => i !== item);
    setSelectedItems(newItems);
    setSelectedItemsName(newItems);
    setLastOptionParam1('');
    setLastOptionParam2('');
  };

  const handleOptionClick = (event, option, index) => {
    event.preventDefault();
    const newItem = {
      name: option,
      param1: lastOptionParam1,
      param2: lastOptionParam2
    }

    if(!nameCreator(newItem, index)){
      return;
    }
    
    const newItems = [...selectedItems, newItem]
    setSelectedItems(newItems);
    setSelectedItemsName([...selectedItemsName, option])
    setIsOpen(false);
    if(onChange){
      onChange(newItems);
    }
    setFilter('');
    setLastOptionParam1('');
    setLastOptionParam2('');
  };

  const optionCreator = (option) => {
    switch (option) {
      case 'resize':
        return (<div className='option-class'>
          <p>Resize</p> 
          <div className='option-param'>
            <input type='text' onChange={(event) => setLastOptionParam1(event.target.value)}/> 
            <p>x</p> 
            <input type='text' onChange={(event) => setLastOptionParam2(event.target.value)}/>
          </div>
        </div>);
      case 'colorspace':
        return (<div className='option-class'>
          <p>ColorSpace</p> <CustomSelect onChange={setLastOptionParam1} options={['GrayScale', 'BGR', 'RGBA', 'HSV']}></CustomSelect>
        </div>);
      case 'flip H':
        return (<div className='option-class'>
          <p>Horizontal Flip</p>
        </div>);
      case 'flip V':
        return (<div className='option-class'>
          <p>Vertical Flip</p>
        </div>);
      case 'blur':
        return (<div className='option-class'>
          <p>Blur</p><div className='option-param'><input type='text' onChange={(event) => setLastOptionParam1(event.target.value)}/></div>
        </div>);
      case 'rotate':
        return (<div className='option-class'>
          <p>Rotate</p> <CustomSelect onChange={setLastOptionParam1} options={['90', '180', '270']}></CustomSelect>
        </div>);
      default:
        break;
    }
  }

  const nameCreator = (item, index) => {
    return index + ". " + processingCreator(item)
  }

  return (
    <div className={`multi-select-2 ${className}`} >
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
        {selectedItems.map((item, index) => (
          <div key={nameCreator(item)} className="selected-item">
            {nameCreator(item, index + 1)}
            <button onClick={() => handleRemoveItem(item)} className="remove-button">&times;</button>
          </div>
        ))} 
      </div> : null}
      {isOpen && (
        <ul className={`select-options ${selectedItems.length > 0 ? "delete-top-border" : "add-top-border"}`} ref={wrapperRef}>
          {filteredOptions.map((option, index) => (
            <li key={index}>
              {optionCreator(option)}
              <Button className="add-button" text="add" onClick={(event) => handleOptionClick(event, option, index)}/>
            </li>
          ))}
          {filteredOptions.length === 0 && <li className="no-options">No options found</li>}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect2;