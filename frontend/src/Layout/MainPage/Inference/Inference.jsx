import React, { useEffect } from 'react';
import './Inference.scss';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import Tabs from '../../../Components/Tabs/Tabs';
import Tab from '../../../Components/Tabs/Tab';
import Overview from './Overview';
import Logs from './Logs';
import Stats from './Stats';
import Cropping from './Cropping';

const Inference = ({ setActiveCallback, toggleMenu }) => {
    useEffect(() => {
        setActiveCallback("Projects");
      }, []);

    return (
        <div className='inference-wrapper'>
            <Header text="Projects" toggleMenu={toggleMenu}/>
            <div className='inference-content-wrapper'>
                <div className='inference-content'>
                    <div className='inference-header'>
                        <Link className="links" to="/projects"><MdKeyboardBackspace size="40px"/></Link>
                        <p>Project details</p>
                    </div>
                    <div className='inference-header-2'>
                        <p className='inference-header-title'>Project details</p>
                        <Tabs>
                            <Tab label="Overview"><Overview/></Tab>
                            <Tab label="Logs"><Logs/></Tab>
                            <Tab label="Stats"><Stats/> </Tab>
                            <Tab label="Cropping"><Cropping/></Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inference;