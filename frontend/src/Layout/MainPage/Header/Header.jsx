import React from 'react';
import './Header.scss';
import Notification from '../../../Components/Notification/Notification';
import { FiLogOut } from "react-icons/fi";
import BurgerMenu from '../../../Components/BurgerMenu/BurgerMenu';

const Header = ({ text, toggleMenu }) => {
  return (
    <div className='header'>
        <BurgerMenu toggleMenu={toggleMenu}/>
        <p>{text}</p>
        <div className='separator'></div>
        <Notification/>
        <a href="/login">
            <FiLogOut size="22"/>
        </a> 
    </div>
  );
};

export default Header;