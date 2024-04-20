import React from 'react';
import { CiSearch } from "react-icons/ci";
import './SearchBar.scss';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className='search-container'>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className='search-input'
                placeholder="Search..."
            />
            <CiSearch className='search-icon' size="25px"/>
        </div>
    );
}

export default SearchBar;