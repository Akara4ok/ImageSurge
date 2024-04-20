import React, { useState } from 'react';
import './MainPage.scss';
import { IoHomeOutline } from "react-icons/io5";
import { GrProjects } from "react-icons/gr";
import { FaDatabase } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link } from 'react-router-dom';
import BurgerMenu from '../../Components/BurgerMenu/BurgerMenu';

const MainPage = ({ active, children, isMenuOpen, toggleMenu }) => {
    const iconSize = "18px"
    return (
        <div className="main-page">
            <nav className={!isMenuOpen ? "displayNone" : ""}>
                <BurgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu}/>
                <img src={process.env.PUBLIC_URL + '/logo.png'} className='logo' />
                <ul className="nav-list">
                    <li className="nav-item">
                        <IoHomeOutline size={iconSize} /> <Link to="/" className={`nav-link ${active === "home" ? "bold" : ""}`}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <GrProjects size={iconSize} /><Link to="/projects" className={`nav-link ${active === "projects" ? "bold" : ""}`}>Projects</Link>
                    </li>
                    <li className="nav-item">
                        <FaDatabase size={iconSize} /><Link to="/datasets" className={`nav-link ${active === "datasets" ? "bold" : ""}`}>Datasets</Link>
                    </li>
                    <li className='separator'></li>
                    <li className="nav-item">
                        <IoIosSettings size={iconSize} /><Link to="/settings" className={`nav-link ${active === "settings" ? "bold" : ""}`}>Settings</Link>
                    </li>
                </ul>
            </nav>
            <div className='main-content'>
                {children}
            </div>
        </div>
    );
};

export default MainPage;