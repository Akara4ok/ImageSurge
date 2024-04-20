import React, { useState } from 'react';
import './LogInForm.scss';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Popup from '../../Components/Popup/Popup';

const LogInForm = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [popupMsg, setPopupMsg] = useState();

    const showForgotPasswordPopup = () => {
        setPopupOpen(true);
        setPopupMsg(<div className='forgotEmail'>
            <h3>Write your email</h3>
            <div>
                <Input type="email" placeholder="Email" />
                <Button text="Send" />
            </div>
            </div>)
    }

    return (
        <div className="login-page">
            <div>
                <div className="login-signup">
                    <a href="/login" className="login-link">Log In</a> |
                    <a href="/signup" className="signup-link">Sign Up</a>
                </div>
            </div>
            <div className="form-container">
                <form className="login-form">
                    <h1>Log In</h1>
                        <Input type="email" placeholder="Email" />
                        <Input type="password" placeholder="Password" />
                        <div className="forgot-password">
                            <a role="button" onClick={showForgotPasswordPopup}>Forgot Password →</a>
                        </div>
                        <Button text="Log In" className="primary" />
                </form>
            </div>
            {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
        </div>
    );
};

export default LogInForm;