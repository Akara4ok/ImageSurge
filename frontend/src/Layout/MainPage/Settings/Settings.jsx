import React, { useEffect, useState } from 'react';
import './Settings.scss';
import Header from '../Header/Header';
import Input from '../../../Components/Input/Input';
import CountrySelector from '../../../Components/CountrySelector/CountrySelector';
import Button from '../../../Components/Button/Button';
import axios from 'axios';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';

const Settings = ({ setActiveCallback, toggleMenu }) => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [popupMsg, setPopupMsg] = useState();
    const [isLoading, setIsLoading] = useState();

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [country, setCountry] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [emailValue, setEmailValue] = useState();
    const [passwordValue, setPasswordValue] = useState();
    const [oldPasswordValue, setOldPasswordValue] = useState();

    useEffect(() => {
        setActiveCallback("settings");
        const token = "Bearer " + localStorage.getItem('token');
        axios({
          method: 'get',
          url: 'http://localhost:8000/user/me/',
          headers: {
            authorization: token
          }
        }).then((response) => {
            setIsLoading(false);
            setFirstName(response.data?.user?.FirstName);
            setLastName(response.data?.user?.LastName);
            setCountry(response.data?.user?.Country);
            setPhoneNumber(response.data?.user?.PhoneNumber);
            setEmailValue(response.data?.user?.Email);
            setOldPasswordValue("");
            setPasswordValue("");
        }).catch((error) => {
          setIsLoading(false);
          setPopupMsg(error.response?.data ?? "Undefined Error");
          setPopupOpen(true);
        });
      }, []);

    const updateData = (event) => {
        const token = "Bearer " + localStorage.getItem('token');

        event.preventDefault()
        setIsLoading(true);
        axios({
          method: 'put',
          url: 'http://localhost:8000/user/me/',
          headers: {
            authorization: token
          },
          data: {
            FirstName: firstName,
            LastName: lastName,
            Email: emailValue,
            PhoneNumber: phoneNumber,
            Country: country,
            NewPassword: passwordValue,
            OldPassword: oldPasswordValue
        }
        }).then((response) => {
            console.log(response)

            setIsLoading(false);
            setFirstName(response.data?.user?.FirstName);
            setLastName(response.data?.user?.LastName);
            setCountry(response.data?.user?.Country);
            setPhoneNumber(response.data?.user?.PhoneNumber);
            setEmailValue(response.data?.user?.Email);
            setOldPasswordValue("");
            setPasswordValue("");
            setPopupMsg("Data updated");
            setPopupOpen(true);
        }).catch((error) => {
          setIsLoading(false);
          setPopupMsg(error.response?.data?.error ?? "Undefined Error");
          setPopupOpen(true);
        })
    }

    return (
        <div className='settings-wrapper'>
            <Header text="Settings" toggleMenu={toggleMenu}/>
            <form className='settings-content'>
                <div className="single-line">
                    <Input type="text" onChange={(value) => setFirstName(value)} value={firstName} />
                    <Input type="text" onChange={(value) => setLastName(value)} value={lastName} />
                </div>
                <div className="single-line">
                <Input type="email" onChange={(value) => setEmailValue(value)} value={emailValue} />
                </div>
                <div className="single-line">
                    <CountrySelector onChange={(value) => setCountry(value)} currentValue={country}/>
                    <Input type="tel" onChange={(value) => setPhoneNumber(value)} value={phoneNumber} />
                </div>
                <div className="single-line">
                    <Input type="password" onChange={(value) => setOldPasswordValue(value)} value={oldPasswordValue} placeholder="Old password" />
                    <Input type="password" onChange={(value) => setPasswordValue(value)} value={passwordValue} placeholder="New password" />
                </div>
                <Button text="Save" onClick={updateData}/>
                {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
                {isLoading ? <Spinner/> : null}
            </form>
        </div>
    );
};

export default Settings;