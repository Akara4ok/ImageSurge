import React from 'react';
import './BurgerMenu.scss';
import { FiMenu } from 'react-icons/fi';
import { RxCross1 } from "react-icons/rx";

const BurgerMenu = ({ isOpen, toggleMenu }) => {
  return (
    <button className="burger-button" onClick={toggleMenu}>
        {!isOpen ? <FiMenu /> : <RxCross1 />}
    </button>
  );
};

export default BurgerMenu;