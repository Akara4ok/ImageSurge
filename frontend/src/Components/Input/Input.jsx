import React from 'react';
import './Input.scss';

const Input = ({ label, type, placeholder, defaultValue, options, ...props }) => {
  let inputField;

  switch (type) {
    case 'select':
      inputField = (
        <select {...props}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      break;
    case 'checkbox':
      inputField = <input type={type} {...props} />;
      break;
    default:
      inputField = <input type={type} placeholder={placeholder} {...props} defaultValue={defaultValue} />;
  }

  return (
    <div className={`input-component ${type}`}>
      {label && type !== 'checkbox' && <label>{label}</label>}
      {inputField}
      {label && type === 'checkbox' && <label>{label}</label>}
    </div>
  );
};

export default Input;
