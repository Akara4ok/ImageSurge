import React from 'react';
import './ProjectRow.scss';
import { LiaSpinnerSolid } from "react-icons/lia";
import { CiCircleCheck } from "react-icons/ci";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import axios from 'axios';


const ProjectRow = ({ project, onDelete }) => {
    const iconSize = '25px';

    const statusIcons = {
        'Stopped': <FaStop className="status-icon" size={iconSize} />,
        'Running': <CiCircleCheck className="status-icon" size={iconSize} />,
        'Creating': <LiaSpinnerSolid className="status-icon" size={iconSize} />,
        'Loading': <LiaSpinnerSolid className="status-icon" size={iconSize} />
    };

    const deleteProject = () => {
        const token = "Bearer " + localStorage.getItem('token');
        axios({
          method: 'delete',
          url: 'http://localhost:8000/project/' + project.id,
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
        <div className="project-table-row-wrapper">
            <div className="table-row">
                <span className="center-span">{statusIcons[project.status]}</span>
                <span>{project.name}</span>
                <span className="center-span">{project.cropping ? <MdOutlineCheckBox size={iconSize} /> : <MdOutlineCheckBoxOutlineBlank size={iconSize} />}</span>
                <span>{project.createdAt}</span>
                <span className="action-span">
                    <button className="action-button">{project.status === "working" ? <FaPlay size={iconSize} /> : <FaPause size={iconSize} />}</button>
                    <button className="delete-btn" onClick={deleteProject}>Delete</button>
                </span>
            </div>
        </div>
    );
}

export default ProjectRow;
