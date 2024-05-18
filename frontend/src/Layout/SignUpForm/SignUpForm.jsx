import {React, useState} from 'react';
import './SignUpForm.scss';
import axios from 'axios';
import Popup from '../../Components/Popup/Popup';
import Spinner from '../../Components/Spinner/Spinner';
import { useNavigate } from 'react-router-dom';
import UserForm from '../MainPage/UserForm/UserForm';
import { socket } from '../../utils/socket';

const SignUpForm = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMsg, setPopupMsg] = useState();
  const [isLoading, setIsLoading] = useState();

    const navigate = useNavigate();

    const handleSubmit = (firstName, lastName, country, phoneNumber, emailValue, passwordValue, confirmPasswordValue) => {
        setIsLoading(true);
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
                socket.connect();
                socket.emit('authenticate', token);
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
              <div className='signup-form'>
                <h1>Create Account</h1>
                <UserForm requestFun={handleSubmit} firstPassPlaceholder="Password" seconfPassPlaceholder={"Confirm Password"} samePasswords={true}/>
              </div>
                {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
                {isLoading ? <Spinner/> : null}
            </div>
        </div>
    );
};

export default SignUpForm;