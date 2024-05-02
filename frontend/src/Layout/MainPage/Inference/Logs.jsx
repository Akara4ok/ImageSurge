import React, { useEffect, useRef, useState } from 'react';
import './Logs.scss';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';
import { socket } from '../../../utils/socket';

const Logs = () => {
    const [popupMsg, setPopupMsg] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState();
    const [logs, setLogs] = useState([]);
    const [updated, setUpdated] = useState(false);

    const { id } = useParams();

    const logRef = useRef(null);

    const createLog = (time, status, functionName, value) => {
        return (new Date(time)).toLocaleString() + " " + status + " " + functionName + ": " + value;
    } 

    useEffect(() => {
        const token = "Bearer " + localStorage.getItem('token');
        socket.on('log', (message) => {
            const splitted = message.split("; ");
            if(splitted.length !== 4){
                return;
            }
            const newLog = createLog(splitted[0], splitted[1], splitted[2], splitted[3]);
            setLogs(logs => {return [...logs, newLog]});
          });
        setIsLoading(true);
        axios({
            method: 'get',
            url: 'http://localhost:8000/project/logs/' + id,
            headers: {
                authorization: token
            }
            }).then((response) => {
                setIsLoading(false);
                const recievedLogs = response.data.logs;
                setLogs(recievedLogs.map((log) => {
                    return createLog(log.Time, log.StatusCode, log.Function, log.Value);
                }));
            }).catch((error) => {
                setIsLoading(false);
                let msg = error.response?.data?.error;
                if(!msg){
                    msg = error.response?.data;
                }
                setPopupMsg(msg ?? "Undefined Error");
                setPopupOpen(true);
                });

        return () => {
            socket.off("log");
        }
        }, []);

    useEffect(() => {
        console.log("log")
        logRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    return (
        <div className='logs-wrapper'>
            <ul className="logs">
                {logs.map((log, index) => (
                <li key={index} className="log">
                    {log}
                </li>
                ))}
                <div ref={logRef} />
            </ul>
            {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
            {isLoading ? <Spinner/> : null}
        </div>
    );
};

export default Logs;