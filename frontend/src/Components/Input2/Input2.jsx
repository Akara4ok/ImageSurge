import React from 'react';
import './Input2.scss';
import CustomSelect from '../CustomSelect/CustomSelect';
import FileUpload from '../FileUpload/FileUpload';
import MultiSelect from '../MultiSelect/MultiSelect';
import MultiSelect2 from '../MultiSelect2/MultiSelect2';

const Input2 = ({ label, type, errorMsg, onChange, placeholder, value, options, tooltips, ...props }) => {
    let inputField;

    switch (type) {
        case 'select':
            inputField = (
                <CustomSelect
                    onChange={(event) => onChange ? onChange(event.target?.value) : null}
                    options={options}
                    tooltips={tooltips}
                    onOptionSelect={onChange}
                />
            );
            break;
        case 'multi-select':
            inputField = (
                <MultiSelect
                    onChange={(event) => onChange ? onChange(event.target?.value) : null}
                    options={options}
                    onOptionSelect={onChange}
                    {...props}
                />
            );
            break;
        case 'multi-select-2':
            inputField = (
                <MultiSelect2
                    onChange={(event) => onChange ? onChange(event.target?.value) : null}
                    options={options}
                    onOptionSelect={onChange}
                    {...props}
                />
            );
            break;
        case 'checkbox':
            inputField = <div className='switch-wrapper'>
                <p>{placeholder}</p>
                <label className="switch" htmlFor="checkbox">
                    <input onChange={(event) => onChange ? onChange(event.target?.value) : null} type="checkbox" value={value} id="checkbox" />
                    <div className="slider round"></div>
                </label>
            </div>

            break;
        case 'files':
            inputField = <FileUpload value={value} onChange={(file) => onChange ? onChange(file) : null} />
            break
        default:
            inputField = <input
                onChange={(event) => onChange ? onChange(event.target?.value) : null}
                type={type}
                placeholder={placeholder}
                {...props}
                value={value} />;
    }

    return (
        <div className={`input-component-2 ${type} ${errorMsg ? 'error-input' : ''}`}>
            {label && <label>{label}</label>}
            {inputField}
            {errorMsg ? <div className='error-input-msg'>{errorMsg}</div> : null}
        </div>
    );
};

export default Input2;
