import React from 'react';
import ProjectRow from './DatasetRow';
import './DatasetList.scss';

const DatasetList = ({nameFilter}) => {
  const datasets = [
    { id: 1, name: 'Dataset 1', images: '2300', category: 'Animals', createdAt: '13/04/2024' },
    { id: 2, name: 'Dataset 2', images: '1200', category: 'General', createdAt: '13/04/2024' },
    { id: 3, name: 'Dataset 3', images: '4500', category: 'Faces', createdAt: '13/04/2024' },
    // { id: 3, name: 'Dataset 3', status: 'loading', cropping: true, createdAt: '13/04/2024' },
    // { id: 3, name: 'Dataset 3', status: 'loading', cropping: true, createdAt: '13/04/2024' },
    // { id: 3, name: 'Dataset 3', status: 'loading', cropping: true, createdAt: '13/04/2024' },
  ];

  return (
    <div className="dataset-list">
        <div className="table-header">
          <span>Name</span>
          <span className="center-span">Images</span>
          <span>Category</span>
          <span>Created At</span>
          <span></span>
        </div>
        <div className="table-body">
            {datasets.map((project) => (
                !nameFilter || project.name.includes(nameFilter)  ? <ProjectRow key={project.id} project={project} /> : null
            ))}
        </div>
    </div>
  );
}

export default DatasetList;
