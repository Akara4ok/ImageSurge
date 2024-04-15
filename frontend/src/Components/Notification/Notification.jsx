import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineBell } from "react-icons/ai";
import './Notification.scss';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message from John' },
    { id: 2, message: 'Meeting at 3 PM' },
    { id: 3, message: 'Update available' }
  ]);
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
          {notifications.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
          <li className="clear" onClick={closeDropdown}>Clear Notifications</li>
        </ul>
      )}
    </div>
  );
};

export default Notification;