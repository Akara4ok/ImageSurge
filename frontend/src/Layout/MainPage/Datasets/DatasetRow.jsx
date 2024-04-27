import React from 'react';
import './DatasetRow.scss';
import axios from 'axios';

const DatasetRow = ({ dataset, onDelete }) => {
    const deleteDataset = () => {
        const token = "Bearer " + localStorage.getItem('token');
        axios({
          method: 'delete',
          url: 'http://localhost:8000/dataset/' + dataset.id,
          headers: {
            authorization: token
          }
        }).then((response) => {
            onDelete("");
        }).catch((error) => {
            onDelete(error.response.data);
        });
    }

    return (
        <div className="dataset-table-row-wrapper">
            <div className="table-row">
                <span>{dataset.name}</span>
                <span className="center-span">{dataset.imagesNum}</span>
                <span>{dataset.category}</span>
                <span>{dataset.createdAt}</span>
                <span className="end-span"><button className="delete-btn" onClick={deleteDataset}>Delete</button></span>
            </div>
        </div>
    );
}

export default DatasetRow;
