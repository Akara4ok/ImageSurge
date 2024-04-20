import React from 'react';
import ProjectRow from './ProjectRow';
import './ProjectList.scss';

const ProjectList = ({nameFilter}) => {
  const projects = [
    { id: 1, name: 'Project 1', status: 'stopped', cropping: true, createdAt: '13/04/2024' },
    { id: 2, name: 'Project 2', status: 'working', cropping: false, createdAt: '13/04/2024' },
    { id: 3, name: 'Project 3', status: 'loading', cropping: true, createdAt: '13/04/2024' },
    // { id: 3, name: 'Project 3', status: 'loading', cropping: true, createdAt: '13/04/2024' },
    // { id: 3, name: 'Project 3', status: 'loading', cropping: true, createdAt: '13/04/2024' },
    // { id: 3, name: 'Project 3', status: 'loading', cropping: true, createdAt: '13/04/2024' },
  ];

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
                !nameFilter || project.name.includes(nameFilter)  ? <ProjectRow key={project.id} project={project} /> : null
            ))}
        </div>
    </div>
  );
}

export default ProjectList;
