import React, { useState, useMemo, useEffect } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import './CountrySelector.scss'

const dropdownIndicatorStyle = (provided) => ({
  ...provided,
  color: '#888', // color of the dropdown arrow
  '&:hover': {
    color: '#555', // color of the dropdown arrow when hovering
  }
})

const defaultStyle = {
  control: (provided, state) => ({
    ...provided,
    background: '#f6f6f6',
    height: '70px',
    width: 'auto',
    border: 0,
    boxShadow: 'none'

  }),
  dropdownIndicator: dropdownIndicatorStyle,
};

const errorStyle = {
  control: (provided, state) => ({
    ...provided,
    background: '#f6f6f6',
    height: '70px',
    width: 'auto',
    border: '1px solid #7f0000',
    boxShadow: 'none'

  }),
  dropdownIndicator: dropdownIndicatorStyle,
};


const CountrySelector = ({ currentValue, onChange, errorMsg }) => {
  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  useEffect(() => {
    if (!currentValue) {
      return
    }
    const key = countryList().getValue(currentValue)
    setValue({ value: key, label: currentValue })
  }, [currentValue]);

  const changeHandler = value => {
    setValue(value);
    if (onChange) {
      onChange(value?.label);
    }
  }

  return (
    <div className='selector-wrapper'>
      <Select options={options} styles={errorMsg ? errorStyle : defaultStyle} value={value} onChange={changeHandler} placeholder="Country" className='selector-component' />
      {errorMsg ? <div className='error-input-msg'>{errorMsg}</div> : null}
    </div>
  )
}

export default CountrySelector