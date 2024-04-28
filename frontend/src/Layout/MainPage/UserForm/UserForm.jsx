import React, { useState, useEffect } from 'react';
import './UserForm.scss';
import Input from '../../../Components/Input/Input';
import CountrySelector from '../../../Components/CountrySelector/CountrySelector';
import Button from '../../../Components/Button/Button';
import {emailValidate, phoneValidate, nameValidate, passwordValidate} from '../../../Validators/Validators'

const UserForm = ({ defaultValueProp, firstPassPlaceholder, seconfPassPlaceholder, samePasswords, requestFun }) => {
  const [firstName, setFirstName] = useState(defaultValueProp?.firstName ?? "");
  const [lastName, setLastName] = useState(defaultValueProp?.lastName ?? "");
  const [country, setCountry] = useState(defaultValueProp?.country ?? "");
  const [phoneNumber, setPhoneNumber] = useState(defaultValueProp?.phoneNumber ?? "");
  const [emailValue, setEmailValue] = useState(defaultValueProp?.emailValue ?? "");
  const [firstPasswordValue, setFirstPasswordValue] = useState("");
  const [secondPasswordValue, setSecondPasswordValue] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [emailValueError, setEmailValueError] = useState("");
  const [firstPasswordValueError, setFirstPasswordValueError] = useState("");
  const [secondPasswordValueError, setSecondPasswordValueError] = useState("");

  useEffect(() => {
    setFirstName(defaultValueProp?.firstName ?? "");
    setLastName(defaultValueProp?.lastName ?? "");
    setCountry(defaultValueProp?.country ?? "");
    setPhoneNumber(defaultValueProp?.phoneNumber ?? "");
    setEmailValue(defaultValueProp?.emailValue ?? "");
    setFirstPasswordValue("");
    setSecondPasswordValue("");
  }, [defaultValueProp])


  const submitHandler = (event) => {
    event.preventDefault()
    const firstNameError = nameValidate(firstName);
    setFirstNameError(firstNameError);
    const lastNameError = nameValidate(lastName);
    setLastNameError(lastNameError);
    const emailValueError = emailValidate(emailValue);
    setEmailValueError(emailValueError);
    const phoneNumberError = phoneValidate(phoneNumber);
    setPhoneNumberError(phoneNumberError);
    const firstPasswordValueError = passwordValidate(firstPasswordValue);
    setFirstPasswordValueError(firstPasswordValueError);
    let secondPasswordValueError = passwordValidate(secondPasswordValue);
    
    if(samePasswords){
      if(firstPasswordValue !== secondPasswordValue){
        secondPasswordValueError = "Password mismatch";
      } else {
        secondPasswordValueError = "";
      }
    }
    setSecondPasswordValueError(secondPasswordValueError);

    const countryError = !country ? "Country is empty" : ""
    setCountryError(countryError)

    if(firstNameError || lastNameError || emailValueError || countryError || phoneNumber || firstPasswordValueError || secondPasswordValueError){
      return;
    }
    requestFun(firstName, lastName, country, phoneNumber, emailValue, firstPasswordValue, secondPasswordValue)
  }

  return (
    <form className='user-form'>
        <div className={`single-line ${firstNameError || lastNameError ? "error-line" : ""}`}>
            <Input type="text" errorMsg={firstNameError} onChange={(value) => setFirstName(value)} value={firstName} placeholder="First Name" />
            <Input type="text" errorMsg={lastNameError} onChange={(value) => setLastName(value)} value={lastName} placeholder="Last Name" />
        </div>
        <div className={`single-line ${emailValueError ? "error-line" : ""}`}>
            <Input type="email" errorMsg={emailValueError} onChange={(value) => setEmailValue(value)} value={emailValue} placeholder="Email Address" />
        </div>
        <div className={`single-line ${phoneNumberError ? "error-line" : ""}`}>
            <CountrySelector onChange={(value) => setCountry(value)} currentValue={country} />
            <Input type="tel" errorMsg={phoneNumberError} onChange={(value) => setPhoneNumber(value)} value={phoneNumber} placeholder="Phone Number" />
        </div>
        <div className={`single-line ${firstPasswordValueError || secondPasswordValueError ? "error-line" : ""}`}>
            <Input type="password" errorMsg={firstPasswordValueError} onChange={(value) => setFirstPasswordValue(value)} value={firstPasswordValue} placeholder={firstPassPlaceholder} />
            <Input type="password" errorMsg={secondPasswordValueError} onChange={(value) => setSecondPasswordValue(value)} value={secondPasswordValue} placeholder={seconfPassPlaceholder} />
        </div>
        <Button text="Save" onClick={submitHandler} />
    </form>
  );
};

export default UserForm;