import React, { useEffect, useState } from 'react';
import './Projects.scss';
import Header from '../Header/Header';
import ProjectList from './ProjectList';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { Link } from 'react-router-dom';

const Projects = ({ setActiveCallback, toggleMenu }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (newValue) => {
        setSearchValue(newValue);
    };

    useEffect(() => {
        setActiveCallback("projects");
      }, []);

    return (
        <div className='projects-wrapper'>
            <div className='projects-content'>
                <div className="project-header">
                    <SearchBar onChange={handleSearchChange} />
                    <Link to="/createproject"><button className="new-project-btn">+ New Project</button></Link>
                </div>
                <ProjectList nameFilter={searchValue} />
            </div>
        </div>
    );
};

export default Projects;