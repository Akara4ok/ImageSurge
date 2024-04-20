import React from 'react';
import './Stats.scss';
import List from './List';

const Stats = () => {
    return (
        <div className='stats-wrapper'>
            <List options={[
                { key: "Total requests", value: "25" },
                { key: "Total images", value: "2500" },
                { key: "Total working time", value: "13h 25m 23s" },
                {
                    key: "Image per request", value: "100"
                },
                {
                    key: "Average per request", value: "40s"
                }
            ]} />
             <List options={[
                { key: "Average image processing time", value: "4s" },
                { key: "Validation time", value: "1s" },
                { key: "Classification time", value: "1s" },
                {
                    key: "Cropping time", value: "2s"
                },
                {
                    key: "Average image quality", value: "5.4"
                }
            ]} />
        </div>
    );
};

export default Stats;