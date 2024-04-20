import React, { useState } from 'react';
import './Tabs.scss';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className='tabs-wrapper'>
      <ul className="tabs">
        {children.map((tab) => (
          <li key={tab.props.label} className={tab.props.label === activeTab ? 'active' : ''}>
            <button onClick={(e) => handleClick(e, tab.props.label)}>
              {tab.props.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {children.map((one) => {
          if (one.props.label === activeTab) return <div key={one.props.label} className='wrapper'>{one.props.children}</div>;
          else return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
