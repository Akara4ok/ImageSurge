import React, { useState } from 'react';
import './CopyKeyButton.scss'
import axios from 'axios';
import Popup from '../../../Components/Popup/Popup';
import { useParams } from 'react-router-dom';

const CopyKeyButton = () => {
  const [copySuccess, setCopySuccess] = useState('Copy Secret Key');
  const [popupMsg, setPopupMsg] = useState();
  const [isPopupOpen, setPopupOpen] = useState(false);

  const { id } = useParams();

  const handleCopy = async () => {
    const token = "Bearer " + localStorage.getItem('token');
    axios({
        method: 'get',
        url: 'http://localhost:8000/user/project/key/' + id,
        headers: {
            authorization: token
        }
        }).then(async (response) => {
            const key = response.data.key;
            try {
                await navigator.clipboard.writeText(key);
                setCopySuccess('Copied!');
              } catch (err) {
                setCopySuccess('Failed to copy!');
              }
            setTimeout(() => {
                setCopySuccess('Copy Secret Key')
            }, 1000);
        }).catch((error) => {
        let msg = error.response?.data?.error;
        if(!msg){
            msg = error.response?.data;
        }
        setPopupMsg(msg ?? "Undefined Error");
        setPopupOpen(true);
        });
  };

  return (
    <div>
      <button className='copy-key-button' onClick={handleCopy}>{copySuccess}</button>
      {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
    </div>
  );
}

export default CopyKeyButton;