import React, {useState} from 'react';
import './Cropping.scss';
import Slider from '../../../Components/Slider/Slider';
import Button from '../../../Components/Button/Button';
import { ImageTable } from '../../../utils/ImageTable';

const Cropping = () => {
    const [enabled, setEnabled] = useState('True');
    const [images, setImages] = useState(['0','0','0','0','0']) 

    return (
        <div className='cropping-wrapper'>
            <div className='cropping-header'>
                <p>Enabled: </p><p>{enabled}</p>
            </div>
            {enabled === "True" ? 
                <div className='cropping-content'>
                    <div className='settings'>
                        <div className='sliders'> 
                            <div className='slider'>Level <Slider min={1} max={20} defaultValue={7} /></div>
                            <div className='slider'>Similarity <Slider min={1} max={100} defaultValue={60}/></div>
                        </div>
                        <Button className="white-button" text="Show test images"/>
                        <Button text="Save"/>
                    </div>
                    <div className='images'>
                    {images.map((image, index) => (
                        <img key={index} src={process.env.PUBLIC_URL + '/logo.png'} />
                    ))}
                    </div>
                </div>
            : null}
        </div>
    );
};

export default Cropping;