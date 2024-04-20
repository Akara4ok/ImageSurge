import React from 'react';
import './Overview.scss';
import List from './List';

const Overview = () => {
    return (
        <div className='overview-wrapper'>
            <List options={[
                {key: "Name", value: "Project1"},
                {key: "Status", value: "Running"},
                {key: "Cropping", value: "Yes"},
                {key: "Dataset", value: <ul>
                <li>
                    Dataset1
                </li>
                <li>
                    Dataset2
                </li>
            </ul>},
                {key: "Posprocessing", value: <ol>
                <li>
                    Grayscale
                </li>
                <li>
                    Resize 224x224
                </li>
            </ol>}
            ]} />
        </div>
    );
};

export default Overview;