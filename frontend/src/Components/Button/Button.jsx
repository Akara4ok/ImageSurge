import React from 'react';
import './Button.scss';

const Button = ({ text, className, ...props }) => {
  return (
    <button className={`button-component ${className}`} {...props}>
      {text}
    </button>
  );
};

export default Button;