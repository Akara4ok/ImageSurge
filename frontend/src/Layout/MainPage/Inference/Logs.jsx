import React from 'react';
import './Logs.scss';

const Logs = () => {
    const logs = ["Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut amet ab perspiciatis tempora voluptatibus, blanditiis tenetuecusandae, officiis quasi.",
                    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut amet ab perspiciatis tempora voluptatibus, blanditiis tene Recusandae, officiis quasi.",
                    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut amet ab perspiciatis tempora voluptatibus, blanditiis tene Recusandae, officiis quasi."]
    
    return (
        <div className='logs-wrapper'>
            <ul className="logs">
                {logs.map((log, index) => (
                <li key={index} className="log">
                    {log}
                </li>
                ))}
            </ul>
        </div>
    );
};

export default Logs;