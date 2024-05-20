import React, { useState } from 'react';
import './Slider.scss';

const Slider = ({min, max, value, onChange}) => {

    const handleInputChange = (event) => {
        onChange(event.target.value);
    };


    return (
        <div className="range-slider">
            <input className="range-slider__range" type="range" value={value} onChange={handleInputChange}
                min={min} max={max} />
            <input className="range-slider__value" type="number" value={value} onChange={handleInputChange} min={min} max={max}/>
        </div>
    );
};

export default Slider;