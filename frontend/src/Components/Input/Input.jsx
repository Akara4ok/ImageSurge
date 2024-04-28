import {React} from 'react';
import './Input.scss';

const Input = ({ label, ref, type, errorMsg, placeholder, defaultValue, value, onChange, options, ...props }) => {
  let inputField;

  switch (type) {
    case 'select':
      inputField = (
        <select {...props} onChange={(event) => onChange ? onChange(event.target?.value) : null}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      break;
    case 'checkbox':
      inputField = <input type={type} value={value ?? ""} onChange={(event) => onChange ? onChange(event.target?.value) : null} {...props} />;
      break;
    default:
      inputField = <input type={type} value={value ?? ""} onChange={(event) => onChange ? onChange(event.target?.value) : null} placeholder={placeholder} {...props} defaultValue={defaultValue} />;
  }

  return (
    <div className={`input-component ${type} ${errorMsg ? 'error-input' : ''}`}>
      {label && type !== 'checkbox' && <label>{label}</label>}
      {inputField}
      {label && type === 'checkbox' && <label>{label}</label>}
      {errorMsg ? <div className='error-input-msg'>{errorMsg}</div> : null}
    </div>
  );
};

export default Input;
