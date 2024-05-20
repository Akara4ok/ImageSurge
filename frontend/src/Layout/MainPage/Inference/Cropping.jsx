import React, {useEffect, useRef, useState} from 'react';
import './Cropping.scss';
import Slider from '../../../Components/Slider/Slider';
import Button from '../../../Components/Button/Button';
import Popup from '../../../Components/Popup/Popup';
import Spinner from '../../../Components/Spinner/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Image} from 'image-js';

const Cropping = () => {
    const [popupMsg, setPopupMsg] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState();

    const [level, setLevel] = useState(15);
    const [shouldUpdateSim, setShouldUpdateSim] = useState(true);
    const [similarity, setSimilarity] = useState(0.5);
    const [images, setImages] = useState([]);
    const [bbImages, setbbImages] = useState([]);
    
    const [enabled, setEnabled] = useState('True');

    const { id } = useParams();

    useEffect(() => {
      const token = "Bearer " + localStorage.getItem('token');
        setIsLoading(true);
        axios({
            method: 'get',
            url: 'http://localhost:8000/project/cropinfo/' + id,
            headers: {
              authorization: token
            }
          }).then((response) => {
            setIsLoading(false);
            setLevel(response.data.level);
            if(response.data.similarity){
              setShouldUpdateSim(false);
            }
            setSimilarity(response.data.similarity ?? 0.5);
          }).catch(() => {
            setIsLoading(false);
          })
      return () => {
        axios({
          method: 'get',
          url: 'http://localhost:8000/project/croptunestop/' + id,
          headers: {
            authorization: token
          }
        })
      }
    }, [])

    const showTestImage = (event) => {
        event.preventDefault();
        const token = "Bearer " + localStorage.getItem('token');
        setIsLoading(true);
        axios({
            method: 'get',
            url: 'http://localhost:8000/project/croptunestart/' + id,
            headers: {
              authorization: token
            }
          }).then((response) => {
              let sim = similarity;
              if(shouldUpdateSim){
                sim = response.data.similarity;
                setShouldUpdateSim(false);
                setSimilarity(sim);
              }
              const filenames = response.data.filenames;
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
                const images = []
                for (let index = 0; index < responses.length; index++) {
                  const response = responses[index];
                  const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
                  const imageObjectURL = URL.createObjectURL(imageBlob);
                  images.push(imageObjectURL);
                }
                setImages(images);
                drawAllBoxes(id, level, sim, images);
              }).catch((error) => {
                setIsLoading(false);
                setPopupMsg("Somithing went wrong");
              });
          }).catch((error) => {
            setIsLoading(false);
          });
    }


    const testImages = (event) => {
      event?.preventDefault();
      drawAllBoxes(id, level, similarity, images);
    }

    const drawAllBoxes = async (id, level, similarity, images) => {
      const token = "Bearer " + localStorage.getItem('token');
      setIsLoading(true);

      try {
        const response = await axios({
          method: 'get',
          url: 'http://localhost:8000/project/croptunetest/' + id + "/" + level + "/" + similarity,
          headers: {
            authorization: token
          }
        });
        
        const result_crop = response.data.result_crop;
        const drawPromises = [];
        for (let index = 0; index < images.length; index++) {
          const image = images[index];
          const box = result_crop[index]
          drawPromises.push(draw_box(image, box[0], box[1], box[2], box[3]));
        }
        Promise.all(drawPromises).then((images) => {
          setbbImages(images);
          setIsLoading(false);
        }).catch(() => {
          setbbImages([]);
          setIsLoading(false);
          setPopupMsg("Somithing went wrong");
        })
       } catch (error) {
        console.log(error.data);
        setIsLoading(false);
      }
    }

    const onSave = (event) => {
      event.preventDefault();
      const token = "Bearer " + localStorage.getItem('token');
      setIsLoading(true);
      axios({
        method: 'put',
        url: 'http://localhost:8000/project/update/' + id,
        headers: {
          authorization: token
        },
        data: {
          level: level,
          similarity: similarity
        }
      }).then( res => setIsLoading(false)).catch(error => {
        setIsLoading(false);
        let msg = error.response?.data?.error;
        if(!msg){
            msg = error.response?.data;
        }
        setPopupMsg(msg ?? "Undefined Error");
        setPopupOpen(true);
      })
    }

    const recrop = (tl_x, tl_y, br_x, br_y, width, height, ref_width, ref_height) => {
        tl_x = (tl_x / width) * ref_width + 1;
        tl_y = (tl_y / height) * ref_height + 1;
        br_x = (br_x / width) * ref_width - 1;
        br_y = (br_y / height) * ref_height - 1;
        return {tl_x, tl_y, br_x, br_y}
    }

    const draw_box = (image_buffer, tl_x, tl_y, br_x, br_y) => {
        return new Promise(async (resolve, reject) => {
            let image = await Image.load(image_buffer);
            ({tl_x, tl_y, br_x, br_y} = recrop(tl_x, tl_y, br_x, br_y, 224, 224, image.width, image.height));
            image = image.paintPolyline([[tl_x, tl_y],[tl_x, br_y],[br_x, br_y],[br_x, tl_y]], {closed: true});
            resolve(image.toDataURL());
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
                            <div className='slider'>Level <Slider min={1} max={20} value={level} onChange={(value) => setLevel(parseInt(value))} /></div>
                            <div className='slider'>Similarity <Slider min={1} max={100} value={(similarity * 100).toFixed(0)} onChange={(value) => setSimilarity(value / 100)}/></div>
                        </div>
                        <Button className="white-button" onClick={showTestImage} text="Show test images"/>
                        <Button text="Test" onClick={testImages}/>
                        <Button text="Save" onClick={onSave}/>
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