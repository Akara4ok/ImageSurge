import React, { useEffect } from 'react';
import './Projects.scss';
import Header from '../Header/Header';

const Projects = ({ setActiveCallback, toggleMenu, children }) => {
    useEffect(() => {
        setActiveCallback("projects");
      }, []);

    return (
        <div className='projects-wrapper'>
            <Header text="Projects" toggleMenu={toggleMenu}/>
            <div className='projects-content'>
                {children}
            </div>
        </div>
    );
};

export default Projects;