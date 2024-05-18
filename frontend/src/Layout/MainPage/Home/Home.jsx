import React, { useEffect } from 'react';
import './Home.scss';
import Header from '../Header/Header';
import FAQAccordion from '../../../Components/FAQAccordion/FAQAccordion';
import { Link } from 'react-router-dom';

const Home = ({ setActiveCallback, toggleMenu }) => {
    useEffect(() => {
        setActiveCallback("home");
      }, []);

    const faqs = [
    {
        title: "How to send a request for image processing?",
        content: "First, you should create a project and wait for it to train. Then go to the project settings and copy the secret key. Next, send a POST request to url/process with your email, project name, secret key, and a set of images "
    },
    {
        title: "What are the stages of creating a dataset?",
        content: "First, you should specify the unique name and category of the dataset. Next, you need to upload the archive or a link to a Google drive to the archive with images. If the archive is damaged or the number of images is less than 100, the dataset cannot be created. The next step is validation, where the quality of the images is checked. The blur, noise, overall quality are checked and a corresponding rating is given. If it is too low, the image is not included in the final dataset. If the dataset has less than 100 images after validation, its creation is canceled."
    },
    {
        title: "How to improve cropping?",
        content: "Go to the project settings by clicking on it. Next, select the Cropping tab. Then click Load test images. There are 2 parameters that regulate the severity of the algorithm. Similarity and Level. The higher these parameters are, the more likely the algorithm will select a smaller but more likely area. When you change the parameters, you can see the result on the test images. After adjusting these parameters, you can upload new test images to make sure they are correct."
    }
    ];

    return (
        <div className='home-wrapper'>
            <div className='home-content'>
                <div className='button-wrapper'>
                    <Link to="/createdataset"><button>+ New Dataset</button></Link>
                    <Link to="/createproject"><button>+ New Project</button></Link>
                </div>
                <FAQAccordion faqs={faqs} />
            </div>
        </div>
    );
};

export default Home;