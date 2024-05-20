import React, { useEffect, useState } from 'react';
import './Settings.scss';
import Header from '../Header/Header';
import axios from 'axios';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';
import UserForm from '../UserForm/UserForm';

const Settings = ({ setActiveCallback, toggleMenu }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMsg, setPopupMsg] = useState();
  const [isLoading, setIsLoading] = useState();

  const [lastSavedUser, setLastSavedUser] = useState();

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
      setLastSavedUser({
        firstName: response.data?.user?.FirstName,
        lastName: response.data?.user?.LastName,
        country: response.data?.user?.Country,
        phoneNumber: response.data?.user?.PhoneNumber,
        emailValue: response.data?.user?.Email,
      });
    }).catch((error) => {
      setIsLoading(false);
      setPopupMsg(error.response?.data ?? "Undefined Error");
      setPopupOpen(true);
    });
  }, []);

  const checkUserCahnged = (firstName, lastName, country, phoneNumber, emailValue, oldPasswordValue, passwordValue) => {
    return lastSavedUser?.firstName !== firstName || lastSavedUser?.lastName !== lastName || lastSavedUser?.country !== country ||
      lastSavedUser?.phoneNumber !== phoneNumber || lastSavedUser?.emailValue !== emailValue || (oldPasswordValue && passwordValue)
  }

  const updateData = (firstName, lastName, country, phoneNumber, emailValue, oldPasswordValue, passwordValue) => {
    if (!checkUserCahnged(firstName, lastName, country, phoneNumber, emailValue, oldPasswordValue, passwordValue)) {
      return;
    }

    const token = "Bearer " + localStorage.getItem('token');
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
      setIsLoading(false);
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
      <div className='setting-content'>
        <UserForm defaultValueProp={{...lastSavedUser}}
          requestFun = {updateData} samePasswords={false}
          firstPassPlaceholder="OldPassword" seconfPassPlaceholder="New Password" />
      </div>
      {isPopupOpen && <Popup message={popupMsg} onClose={() => { setPopupOpen(false) }} />}
      {isLoading ? <Spinner /> : null}
    </div>
  );
};

export default Settings;