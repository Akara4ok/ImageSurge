import React from 'react';
import './DatasetRow.scss';

const DatasetRow = ({ project }) => {
    const iconSize = '25px';

    return (
        <div className="dataset-table-row-wrapper">
            <div className="table-row">
                <span>{project.name}</span>
                <span className="center-span">{project.images}</span>
                <span>{project.category}</span>
                <span>{project.createdAt}</span>
                <span className="end-span"><button className="delete-btn">Delete</button></span>
            </div>
        </div>
    );
}

export default DatasetRow;
