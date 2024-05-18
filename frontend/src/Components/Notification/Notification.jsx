import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineBell } from "react-icons/ai";
import './Notification.scss';
import { socket } from '../../utils/socket';
import { capitalize } from '../../utils/utils';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNNewNotification] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  const toggleDropdown = () => {
    if(notifications.length === 0){
        return;
    }
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setNotifications([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [bellRef]);

  const onNewMessage = (topic, message) => {
    if(message.includes("Start loading")){
      return;
    }
    const newMessage = capitalize(topic) + ": " + capitalize(message)
    setNotifications(notifications => [newMessage, ...notifications]);
    setNNewNotification(newMessage)
    setTimeout(() => {
      setNNewNotification();
    }, 1000)
  }

  useEffect(() => {
    socket.on('project', (message) => { onNewMessage('project', message) });
    socket.on('dataset', (message) => { onNewMessage('dataset', message) });
  }, []);

  return (
    <div className="notification-bell" ref={bellRef}>
      <button className={`bell-icon ${isOpen ? 'open' : 'closed'}`} onClick={toggleDropdown}>
        <AiOutlineBell />
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </button>
      {isOpen && (
        <ul className="dropdown">
          {notifications.map((notification, index) => (
            <li key={notification + index }>{notification}</li>
          ))}
          <li className="clear" onClick={closeDropdown}>Clear Notifications</li>
        </ul>
      )}
      {newNotification && (
        <ul className="dropdown">
            <li>{newNotification}</li>
        </ul>
      )}
    </div>
  );
};

export default Notification;