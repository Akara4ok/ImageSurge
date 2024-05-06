import React, {useState} from 'react';
import './ProjectRow.scss';
import { LiaSpinnerSolid } from "react-icons/lia";
import { CiCircleCheck } from "react-icons/ci";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import axios from 'axios';
import Popup from '../../../Components/Popup/Popup';
import { useNavigate } from 'react-router-dom';


const ProjectRow = ({ project, onDelete }) => {
    const [popupMsg, setPopupMsg] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const navigate = useNavigate();

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

    const loadProject = (token) => {
        axios({
            method: 'get',
            url: 'http://localhost:8000/project/load/' + project.id,
            headers: {
              authorization: token
            }
          }).then((response) => {
          }).catch((error) => {
            setPopupMsg(error.response?.data ?? "Undefined Error");
            setPopupOpen(true);
          });
    }

    const stopProject = (token) => {
        axios({
            method: 'get',
            url: 'http://localhost:8000/project/stop/' + project.id,
            headers: {
              authorization: token
            }
          }).then((response) => {
          }).catch((error) => {
            setPopupMsg(error.response?.data ?? "Undefined Error");
            setPopupOpen(true);
          });
    }

    const onActionButtonClick = (event) => {
        event.preventDefault();
        const token = "Bearer " + localStorage.getItem('token');
        if(project.status === "Stopped") {
            loadProject(token);
        } else if(project.status === "Running"){
            stopProject(token);
        }
    }

    const goToProject = () => {
        navigate("/project/" + project.id)
    }

    const isLoading = () => {
        return project.status === "Loading" || project.status === "Creating";
    }

    return (
        <div className="project-table-row-wrapper">
            <div className="table-row">
                <span className="center-span">{statusIcons[project.status]}</span>
                <span><button className="name-button" onClick={goToProject}>{project.name}</button></span>
                <span className="center-span">{project.cropping ? <MdOutlineCheckBox size={iconSize} /> : <MdOutlineCheckBoxOutlineBlank size={iconSize} />}</span>
                <span>{project.createdAt}</span>
                <span className="action-span">
                    <button className="action-button" onClick={onActionButtonClick} disabled={isLoading()}>{project.status === "Stopped" ? <FaPlay size={iconSize} /> : <FaPause size={iconSize} />}</button>
                    <button className="delete-btn" onClick={deleteProject} disabled={isLoading()}>Delete</button>
                </span>
            </div>
            {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
        </div>
    );
}

export default ProjectRow;
