import React, { useEffect, useState } from 'react';
import './Datasets.scss';
import Header from '../Header/Header';
import ProjectList from './DatasetList';
import SearchBar from '../../../Components/SearchBar/SearchBar';

const Datasets = ({ setActiveCallback, toggleMenu }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (newValue) => {
        setSearchValue(newValue);
        console.log("Current search value:", newValue);
    };

    useEffect(() => {
        setActiveCallback("datasets");
      }, []);

    return (
        <div className='datasets-wrapper'>
            <Header text="Datasets" toggleMenu={toggleMenu}/>
            <div className='datasets-content'>
                <div className="project-header">
                    <SearchBar onChange={handleSearchChange} />
                    <button className="new-project-btn">+ New Project</button>
                </div>
                <ProjectList nameFilter={searchValue} />
            </div>
        </div>
    );
};

export default Datasets;