import React, { useEffect, useState } from 'react';
import './Stats.scss';
import List from './List';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';

const Stats = () => {
    const [totalRequests, setTotalRequests] = useState(0);
    const [totalImgs, setTotalImgs] = useState(0);
    const [totalWorkingTime, setTotalWirkingTime] = useState(0);
    const [avgTimePerReques, setAvgTimePerReques] = useState(0);
    const [validationTime, setValidationTime] = useState(0);
    const [classificationTime, setClassificationTime] = useState(0);
    const [croppingTime, setCroppingTime] = useState(0);
    const [quality, setQuality] = useState(0);

    const [popupMsg, setPopupMsg] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState();

    const { id } = useParams();

    const parseTime = (time) => {
        time = Math.floor(time)
        const days = Math.floor(time / (3600 * 24));
        time %= (3600 * 24);
        const hours = Math.floor(time / 3600);
        time %= 3600;
        const minutes = Math.floor(time / 60);
        time %= 60;
    
        const parts = [];
        if (days > 0) parts.push(days + "d");
        if (hours > 0) parts.push(hours + "h");
        if (minutes > 0) parts.push(minutes + "m");
        if (time > 0) parts.push(time + "s");
    
        return parts.join(" ");
    }

    useEffect(() => {
        const token = "Bearer " + localStorage.getItem('token');
        setIsLoading(true);
        axios({
            method: 'get',
            url: 'http://localhost:8000/project/stats/' + id,
            headers: {
              authorization: token
            }
          }).then((response) => {
              setIsLoading(false);
              console.log(response.data)
              const stats = response.data.stats;
              if(!stats){
                setPopupMsg("Undefined Error");
                setPopupOpen(true);
                return;
              }

              setTotalRequests(stats.TotalRequests);
              setTotalImgs(stats.Images);
              setTotalWirkingTime(stats.TotalTime);
              setAvgTimePerReques((stats.ProcessingTime / stats.TotalRequests).toFixed(2));
              setValidationTime((stats.ValidationTime / stats.TotalRequests).toFixed(2));
              setClassificationTime((stats.ClassificationTime / stats.TotalRequests).toFixed(2));
              setCroppingTime((stats.CroppingTime / stats.TotalRequests).toFixed(2));
              setQuality((100 - stats.Quality / stats.Images).toFixed(2));

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
        <div className='stats-wrapper'>
            <List options={[
                { key: "Total requests", value: totalRequests },
                { key: "Total images", value: totalImgs },
                { key: "Total working time", value: parseTime(totalWorkingTime) },
                {
                    key: "Image per request", value: (totalImgs / totalRequests).toFixed(2)
                },
                {
                    key: "Average time per request", value: avgTimePerReques + "s"
                }
            ]} />
             <List options={[
                { key: "Average image processing time", value: ((avgTimePerReques / (totalImgs / totalRequests)).toFixed(2)) + "s" },
                { key: "Validation time", value: validationTime + "s" },
                { key: "Classification time", value: classificationTime + "s" },
                {
                    key: "Cropping time", value: croppingTime + "s"
                },
                {
                    key: "Average image quality", value: quality
                }
            ]} />
            {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
            {isLoading ? <Spinner/> : null}
        </div>
    );
};

export default Stats;