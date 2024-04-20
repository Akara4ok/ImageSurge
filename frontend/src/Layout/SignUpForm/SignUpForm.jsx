import React from 'react';
import './SignUpForm.scss';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import CountrySelector from '../../Components/CountrySelector/CountrySelector';

const SignUpForm = () => {
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
                        <Input type="text" placeholder="First Name" />
                        <Input type="text" placeholder="Last Name" />
                    </div>
                    <CountrySelector/>
                    <div className="single-line">
                        <Input type="email" placeholder="Email Address" />
                        <Input type="tel" placeholder="Phone Number" />
                    </div>
                    <div className="single-line">
                        <Input type="password" placeholder="Password" />
                        <Input type="password" placeholder="Confirm Password" />
                    </div>
                    <Button text="Create" className="primary" />
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;