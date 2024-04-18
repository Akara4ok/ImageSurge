import React from 'react';
import './Input2.scss';
import CustomSelect from '../CustomSelect/CustomSelect';
import FileUpload from '../FileUpload/FileUpload';
import MultiSelect from '../MultiSelect/MultiSelect';
import MultiSelect2 from '../MultiSelect2/MultiSelect2';

const Input2 = ({ label, type, placeholder, defaultValue, options, tooltips, onValueChanged, ...props }) => {
    let inputField;

    switch (type) {
        case 'select':
            inputField = (
                <CustomSelect
                    options={options}
                    tooltips={tooltips}
                    onOptionSelect={onValueChanged}
                />
            );
            break;
        case 'multi-select':
            inputField = (
                <MultiSelect
                    options={options}
                    onOptionSelect={onValueChanged}
                    {...props}
                />
            );
            break;
        case 'multi-select-2':
            inputField = (
                <MultiSelect2
                    options={options}
                    onOptionSelect={onValueChanged}
                    {...props}
                />
            );
            break;
        case 'checkbox':
            inputField = <div className='switch-wrapper'>
                <p>{placeholder}</p>
                <label className="switch" htmlFor="checkbox">
                    <input type="checkbox" id="checkbox" />
                    <div className="slider round"></div>
                </label>
            </div>

            break;
        case 'files':
            inputField = <FileUpload />
            break
        default:
            inputField = <input type={type} placeholder={placeholder} {...props} defaultValue={defaultValue} />;
    }

    return (
        <div className={`input-component-2 ${type}`}>
            {label && <label>{label}</label>}
            {inputField}
        </div>
    );
};

export default Input2;
