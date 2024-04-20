import React from 'react';
import './ProjectRow.scss';
import { LiaSpinnerSolid } from "react-icons/lia";
import { CiCircleCheck } from "react-icons/ci";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";



const ProjectRow = ({ project }) => {
    const iconSize = '25px';

    const statusIcons = {
        'stopped': <FaStop className="status-icon" size={iconSize} />,
        'working': <CiCircleCheck className="status-icon" size={iconSize} />,
        'loading': <LiaSpinnerSolid className="status-icon" size={iconSize} />
    };

    return (
        <div className="project-table-row-wrapper">
            <div className="table-row">
                <span className="center-span">{statusIcons[project.status]}</span>
                <span>{project.name}</span>
                <span className="center-span">{project.cropping ? <MdOutlineCheckBox size={iconSize} /> : <MdOutlineCheckBoxOutlineBlank size={iconSize} />}</span>
                <span>{project.createdAt}</span>
                <span className="action-span">
                    <button className="action-button">{project.status === "working" ? <FaPlay size={iconSize} /> : <FaPause size={iconSize} />}</button>
                    <button className="delete-btn">Delete</button>
                </span>
            </div>
        </div>
    );
}

export default ProjectRow;
