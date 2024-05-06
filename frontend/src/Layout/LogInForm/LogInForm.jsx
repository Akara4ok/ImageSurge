import React, { useState } from 'react';
import './LogInForm.scss';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Popup from '../../Components/Popup/Popup';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner/Spinner';

const LogInForm = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [popupMsg, setPopupMsg] = useState();
    const [isLoading, setIsLoading] = useState();
    
    const [emailValue, setEmailValue] = useState();
    const [passwordValue, setPasswordValue] = useState();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        axios({
          method: 'post',
          url: 'http://localhost:8000/login',
          data: {
            email: emailValue,
            password: passwordValue,
          }
        }).then((response) => {
          setIsLoading(false);
          localStorage.setItem('token', response?.data?.token);
          
          navigate("/");
        }).catch((error) => {
          setIsLoading(false);
          setPopupMsg(error.response?.data?.error ?? "Undefined Error");
          setPopupOpen(true);
        })
      };

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
                        <Input type="email" onChange={(value) => setEmailValue(value)} value={emailValue} placeholder="Email" />
                        <Input type="password" onChange={(value) => setPasswordValue(value)} value={passwordValue} placeholder="Password" />
                        <Button text="Log In" className="primary" onClick={event => handleSubmit(event)} />
                </form>
            </div>
            {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
            {isLoading ? <Spinner/> : null}
        </div>
    );
};

export default LogInForm;