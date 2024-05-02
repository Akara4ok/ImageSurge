import React from 'react';
import './List.scss';

const List = ({options}) => {
    return (
        <div className='list-wrapper'>
            <ul className='list-list'>
                {options.map((option, index) => {
                    return (
                        <li key={index} className='list-option'>
                            <p>{option.key}</p>
                            {option.value}
                            {/* {typeof option.value === 'string' || option.value instanceof String ? <p>{option.value}</p> : option.value} */}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default List;