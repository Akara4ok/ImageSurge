import React, { useState, useMemo, useEffect } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import './CountrySelector.scss'

const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: '#f6f6f6',
      height: '70px',
      width: 'auto',
      border: 0,
      boxShadow: 'none'

    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#888', // color of the dropdown arrow
      '&:hover': {
        color: '#555', // color of the dropdown arrow when hovering
      }
    }),
  };
  

const CountrySelector = ({currentValue, onChange}) => {
  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  useEffect(() => {
    if(!currentValue){
      return
    }
    const key = countryList().getValue(currentValue)
    setValue({value: key, label: currentValue})
  }, [currentValue]);

  const changeHandler = value => {
    setValue(value);
    if(onChange){
      onChange(value?.label);
    }
  }

  return <Select options={options} styles={customStyles} value={value} onChange={changeHandler} placeholder="Country" className='selector-component'/>
}

export default CountrySelector