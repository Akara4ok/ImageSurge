import React, { useEffect, useState } from 'react';
import './Overview.scss';
import List from './List';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';
import axios from 'axios';
import { processingCreator } from '../../../utils/utils';

const Overview = () => {
    const [popupMsg, setPopupMsg] = useState();
    const [isLoading, setIsLoading] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [cropping, setCropping] = useState("");
    const [datasets, setDatsets] = useState([]);
    const [postprocessings, setPostprocessings] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        const token = "Bearer " + localStorage.getItem('token');
        setIsLoading(true);
        axios({
            method: 'get',
            url: 'http://localhost:8000/user/project/' + id,
            headers: {
              authorization: token
            }
          }).then((response) => {
              setIsLoading(false);
              console.log(response.data)
              const project = response.data.project;
              if(!project){
                setPopupMsg("Undefined Error");
                setPopupOpen(true);
                return;
              }
              setName(project.Name);
              setStatus(project.Status);
              setCropping(project.Cropping ? "Yes" : "No");
              setDatsets(project.Datasets.map((dataset) => {
                return dataset.Name;
              }));
              if(project.ProjectProcessings){
                setPostprocessings(project.ProjectProcessings.map((processing) => {
                    const splitted = processing.Value.split(" ");
                    return processingCreator({
                        name: splitted.length > 0 ? splitted[0]: undefined,
                        param1: splitted.length > 1 ? splitted[1]: undefined,
                        param2: splitted.length > 2 ? splitted[2]: undefined
                    });
                  }));
              }
          }).catch((error) => {
            setIsLoading(false);
            let msg = error.response?.data?.error;
            if(!msg){
                msg = error.response?.data;
            }
            setPopupMsg(msg ?? "Undefined Error");
            setPopupOpen(true);
          });
      }, []);

    return (
        <div className='overview-wrapper'>
            <List options={[
                {key: "Name", value: name},
                {key: "Status", value: status},
                {key: "Cropping", value: cropping},
                {key: "Dataset", value: <ul>
                {datasets.map(dataset => {return (
                    <li key={dataset}>
                        {dataset}
                    </li>)
                })}
            </ul>},
                {key: "Posprocessing", value: <ol>
                {postprocessings.map(postprocessing => { return (
                <li key={postprocessing}>
                    {postprocessing}
                </li>)
                })}
            </ol>}
            ]} />
            {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
            {isLoading ? <Spinner/> : null}

        </div>
    );
};

export default Overview;