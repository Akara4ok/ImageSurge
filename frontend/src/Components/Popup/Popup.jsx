import React from 'react';
import './Popup.scss';

const Popup = ({ message, buttonMsg, onClose }) => {
    return (
        <div className="popup-background" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <div className='msg'>{message}</div>
                <button onClick={onClose}>{!buttonMsg ? "Close" : buttonMsg}</button>
            </div>
        </div>
    );
}

export default Popup;