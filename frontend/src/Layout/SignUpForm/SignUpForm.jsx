import {React, useState} from 'react';
import './SignUpForm.scss';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import CountrySelector from '../../Components/CountrySelector/CountrySelector';
import axios from 'axios';
import Popup from '../../Components/Popup/Popup';
import Spinner from '../../Components/Spinner/Spinner';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMsg, setPopupMsg] = useState();
  const [isLoading, setIsLoading] = useState();

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [country, setCountry] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [emailValue, setEmailValue] = useState();
    const [passwordValue, setPasswordValue] = useState();
    const [confirmPasswordValue, setConfirmPasswordValue] = useState();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        if(passwordValue !== confirmPasswordValue){
            setPopupMsg("Password mismatch");
            setPopupOpen(true);
        }
        axios({
          method: 'post',
          url: 'http://localhost:8000/register',
          data: {
            FirstName: firstName,
            LastName: lastName,
            Email: emailValue,
            PhoneNumber: phoneNumber,
            Country: country,
            Password: passwordValue
        }
        }).then((response) => {
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
        }).catch((error) => {
          setIsLoading(false);
          setPopupMsg(error.response?.data?.error ?? "Undefined Error");
          setPopupOpen(true);
        })
      };

    return (
        <div className="signup-page">
            <div>
                <div className="login-signup">
                    <a href="/login" className="login-link">Log In</a> |
                    <a href="/signup" className="signup-link">Sign Up</a>
                </div>
            </div>
            <div className="form-container">
                <form className="signup-form">
                    <h1>Create Account</h1>
                    <div className="single-line">
                        <Input type="text" onChange={(value) => setFirstName(value)} value={firstName} placeholder="First Name" />
                        <Input type="text" onChange={(value) => setLastName(value)} value={lastName} placeholder="Last Name" />
                    </div>
                    <div className="country-selector-wrapper"><CountrySelector onChange={(value) => setCountry(value)} currentValue={country}/></div>
                    <div className="single-line">
                        <Input type="email" onChange={(value) => setEmailValue(value)} value={emailValue} placeholder="Email Address" />
                        <Input type="tel" onChange={(value) => setPhoneNumber(value)} value={phoneNumber} placeholder="Phone Number" />
                    </div>
                    <div className="single-line">
                        <Input type="password" onChange={(value) => setPasswordValue(value)} value={passwordValue} placeholder="Password" />
                        <Input type="password" onChange={(value) => setConfirmPasswordValue(value)} value={confirmPasswordValue} placeholder="Confirm Password" />
                    </div>
                    <Button text="Create" className="primary" onClick={event => handleSubmit(event)} />
                </form>
                {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
                {isLoading ? <Spinner/> : null}
            </div>
        </div>
    );
};

export default SignUpForm;