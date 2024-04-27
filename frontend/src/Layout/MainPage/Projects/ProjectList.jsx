import React, {useState, useEffect} from 'react';
import ProjectRow from './ProjectRow';
import './ProjectList.scss';
import axios from 'axios';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';

const ProjectList = ({nameFilter}) => {
  const [projects, setProjects] = useState([]);
  const [popupMsg, setPopupMsg] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    updateProjectList();
  }, []);

  const updateProjectList = () => {
    const token = "Bearer " + localStorage.getItem('token');
    axios({
      method: 'get',
      url: 'http://localhost:8000/user/projects/',
      headers: {
        authorization: token
      }
    }).then((response) => {
        setIsLoading(false);
        setProjects(response.data?.projects?.map(project => {
          return {
            id: project.Id,
            status: project.Status,
            name: project.Name,
            cropping: project.Cropping,
            createdAt: (new Date(project.CreatedAt)).toLocaleString(),
          }
        }));
    }).catch((error) => {
      setIsLoading(false);
      setPopupMsg(error.response?.data ?? "Undefined Error");
      setPopupOpen(true);
    });
  }

  const onDeleteProject = (msg) => {
    setIsLoading(false);
    if(!msg){
      updateProjectList();
      return;
    }
    setPopupMsg(msg);
    setPopupOpen(true);
  }

  return (
    <div className="project-list">
        <div className="table-header">
          <span className="center-span">Status</span>
          <span>Name</span>
          <span className="center-span">Cropping</span>
          <span>Created At</span>
          <span></span>
        </div>
        <div className="table-body">
            {projects.map((project) => (
                !nameFilter || project.name.includes(nameFilter)  ? <ProjectRow key={project.id} project={project} onDelete={onDeleteProject} /> : null
            ))}
        </div>
        {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
        {isLoading ? <Spinner/> : null}
    </div>
  );
}

export default ProjectList;
