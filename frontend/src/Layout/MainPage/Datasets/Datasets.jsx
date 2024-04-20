import React, { useEffect, useState } from 'react';
import './Datasets.scss';
import Header from '../Header/Header';
import ProjectList from './DatasetList';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { Link } from 'react-router-dom';

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
                    <Link to="/createdataset"><button className="new-project-btn">+ New Dataset</button></Link>
                </div>
                <ProjectList nameFilter={searchValue} />
            </div>
        </div>
    );
};

export default Datasets;