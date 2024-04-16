import React, { useEffect, useState } from 'react';
import './Projects.scss';
import Header from '../Header/Header';
import ProjectList from './ProjectList';
import SearchBar from '../../../Components/SearchBar/SearchBar';

const Projects = ({ setActiveCallback, toggleMenu }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (newValue) => {
        setSearchValue(newValue);
        console.log("Current search value:", newValue);
    };

    useEffect(() => {
        setActiveCallback("projects");
      }, []);

    return (
        <div className='projects-wrapper'>
            <Header text="Projects" toggleMenu={toggleMenu}/>
            <div className='projects-content'>
                <div className="project-header">
                    <SearchBar onChange={handleSearchChange} />
                    <button className="new-project-btn">+ New Project</button>
                </div>
                <ProjectList nameFilter={searchValue} />
            </div>
        </div>
    );
};

export default Projects;