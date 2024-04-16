import React, { useEffect } from 'react';
import './Settings.scss';
import Header from '../Header/Header';
import FAQAccordion from '../../../Components/FAQAccordion/FAQAccordion';
import Input from '../../../Components/Input/Input';
import CountrySelector from '../../../Components/CountrySelector/CountrySelector';
import Button from '../../../Components/Button/Button';

const Settings = ({ setActiveCallback, toggleMenu }) => {
    useEffect(() => {
        setActiveCallback("settings");
      }, []);

    return (
        <div className='settings-wrapper'>
            <Header text="Settings" toggleMenu={toggleMenu}/>
            <form className='settings-content'>
                <div className="single-line">
                    <Input type="text" defaultValue="First Name" />
                    <Input type="text" defaultValue="Second Name" />
                </div>
                <div className="single-line">
                <Input type="email" defaultValue="vladshpilka86@gmail.com" />
                </div>
                <div className="single-line">
                    <CountrySelector defaultValue="Ukraine"/>
                    <Input type="text" defaultValue="Second Name" />
                </div>
                <div className="single-line">
                    <Input type="password" placeholder="Old password" />
                    <Input type="password" placeholder="New password" />
                </div>
                <Button text="Save"/>
            </form>
        </div>
    );
};

export default Settings;