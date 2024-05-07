import React, {useEffect, useRef, useState} from 'react';
import './Cropping.scss';
import Slider from '../../../Components/Slider/Slider';
import Button from '../../../Components/Button/Button';
import { ImageTable } from '../../../utils/ImageTable';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Cropping = () => {
    const [popupMsg, setPopupMsg] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState();

    const [features, setFeatures] = useState([]);
    const [filenames, setFilenames] = useState([]);
    const [level, setLevel] = useState(15);
    const [similarity, setSimilarity] = useState(50);
    const [imageTables, setImageTables] = useState([]);
    const [originalImages, setOriginalImages] = useState([]);
    const [bbImages, setBBImages] = useState([]);

    const [enabled, setEnabled] = useState('True');

    const { id } = useParams();

    const showTestImage = (event) => {
        event.preventDefault();
        const token = "Bearer " + localStorage.getItem('token');
        setIsLoading(true);
        axios({
            method: 'get',
            url: 'http://localhost:8000/project/croptune/' + id,
            headers: {
              authorization: token
            }
          }).then((response) => {
              const sim = response.data.similarity;
              setSimilarity((sim * 100).toFixed(2));
              const filenames = response.data.filenames;
              setFilenames(filenames);
              const features = response.data.features;
              setFeatures(features)
              const imageTables = filenames.map(filename => new ImageTable(response.data.cluster_center));
              setImageTables(imageTables)
              const promises = []
              for (let index = 0; index < filenames.length; index++) {
                const filename = filenames[index];
                promises.push(axios({
                    method: 'get',
                    url: 'http://localhost:8000/project/cropimage/' + id + "/" + filename,
                    headers: {
                      authorization: token
                    },
                    responseType: 'blob'
                  }))
              }
              Promise.all(promises).then((responses) => {
                const originalImages = []
                const calcPromises = [];
                for (let index = 0; index < responses.length; index++) {
                  const response = responses[index];
                  const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
                  const imageObjectURL = URL.createObjectURL(imageBlob);
                  originalImages.push(imageObjectURL);
                  
                  calcPromises.push(imageTables[index].calc_and_draw_box(imageObjectURL, features[index], level, sim));
                }
                Promise.all(calcPromises).then((responses) => {
                  setOriginalImages(originalImages);
                  setBBImages(responses);
                  setIsLoading(false);
                }).catch(() => {
                  setIsLoading(false);
                  setPopupMsg("Somithing went wrong");
                })
              }).catch((error) => {
                setIsLoading(false);
                setPopupMsg("Somithing went wrong");
              });
          }).catch((error) => {
            setIsLoading(false);
          });
    }


    const testImages = (event) => {
      event.preventDefault();
      setIsLoading(true);

      const calcPromises = [];
      for (let index = 0; index < originalImages.length; index++) {
        const image = originalImages[index];
        calcPromises.push(imageTables[index].calc_and_draw_box(image, features[index], level, similarity / 100));
      }
      Promise.all(calcPromises).then((responses) => {
        setBBImages(responses);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
        setPopupMsg("Somithing went wrong");
      });
    }


    return (
        <div className='cropping-wrapper'>
            <div className='cropping-header'>
                <p>Enabled: </p><p>{enabled}</p>
            </div>
            {enabled === "True" ? 
                <div className='cropping-content'>
                    <div className='settings'>
                        <div className='sliders'> 
                            <div className='slider'>Level <Slider min={1} max={20} value={level} onChange={setLevel} /></div>
                            <div className='slider'>Similarity <Slider min={1} max={100} value={similarity} onChange={setSimilarity}/></div>
                        </div>
                        <Button className="white-button" onClick={showTestImage} text="Show test images"/>
                        <Button text="Test" onClick={testImages}/>
                        <Button text="Save"/>
                    </div>
                    <div className='images'>
                    {bbImages?.map((image, index) => (
                        <img key={index} src={image}/>
                    ))}
                    </div>
                </div>
            : null}
            {isPopupOpen && <Popup message={popupMsg} onClose={() => {setPopupOpen(false)}} />}
            {isLoading ? <Spinner/> : null}
        </div>
    );
};

export default Cropping;