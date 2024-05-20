import {React, useState, useEffect} from 'react';
import DatasetRow from './DatasetRow';
import './DatasetList.scss';
import axios from 'axios';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';
import { socket } from '../../../utils/socket';

const DatasetList = ({nameFilter}) => {
  const [popupMsg, setPopupMsg] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [datasets, setDatsets] = useState([]);

  useEffect(() => {
    updateDatasetList();
    socket.on('dataset', (message) => {
      if(!message){
        return;
      }
      const parsed_message = message.split(" ");
      if(parsed_message.length < 2){
        return;
      }
      updateDatasetList();
    });

  }, []);

  const updateDatasetList = () => {
    const token = "Bearer " + localStorage.getItem('token');
    axios({
      method: 'get',
      url: 'http://localhost:8000/user/datasets/',
      headers: {
        authorization: token
      }
    }).then((response) => {
        setIsLoading(false);
        setDatsets(response.data?.datasets?.map(dataset => {
          return {
            id: dataset.Id,
            name: dataset.Name,
            status: dataset.Status,
            imagesNum: dataset.ImagesNum,
            category: dataset.Category.Name,
            quality: (100 - parseFloat(dataset.Quality)).toPrecision(4),
            createdAt: (new Date(dataset.CreatedAt)).toLocaleString(),
          }
        }));
    }).catch((error) => {
      setIsLoading(false);
      setPopupMsg(error.response?.data ?? "Undefined Error");
      setPopupOpen(true);
    });
  }

  const onDeleteDataset = (msg) => {
    setIsLoading(false);
    if(!msg){
      updateDatasetList();
      return;
    }
    setPopupMsg(msg);
    setPopupOpen(true);
  }

  return (
    <div className="dataset-list">
        <div className="table-header">
          <span>Name</span>
          <span className="center-span">Images</span>
          <span className="center-span">Quality</span>
          <span>Category</span>
          <span>Created At</span>
          <span></span>
        </div>
        <div className="table-body">
            {datasets.map((dataset) => (
                !nameFilter || dataset.name.includes(nameFilter)  
                ? 
                <DatasetRow key={dataset.id} dataset={dataset} onDelete={onDeleteDataset} /> : null
            ))}
        </div>
        {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
        {isLoading ? <Spinner/> : null}
    </div>
  );
}

export default DatasetList;
