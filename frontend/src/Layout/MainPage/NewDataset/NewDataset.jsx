import React, { useEffect } from 'react';
import './NewDataset.scss';
import Header from '../Header/Header';
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from 'react-router-dom';
import Input2 from '../../../Components/Input2/Input2';
import Button from '../../../Components/Button/Button';

const NewDataset = ({ setActiveCallback, toggleMenu }) => {
    useEffect(() => {
        setActiveCallback("datasets");
      }, []);

    return (
        <div className='home-wrapper'>
            <Header text="Datasets" toggleMenu={toggleMenu}/>
            <div className='datasets-create-wrapper'>
                <div className='datasets-create-content'>
                    <div className='datasets-create-header'>
                        <Link className="links" to="/datasets"><MdKeyboardBackspace size="40px"/></Link>
                        <p>New Dataset</p>
                    </div>
                    <form>
                        <Input2 type="text" label="Name" placeholder="e.g. Name"/>
                        <Input2 className="select-category" type="select" label="Category" options={["General", "Animals", "Faces"]} placeholder="e.g. Name"/>
                        <Input2 type="files" label="Files"/>
                        <Button text="Create"></Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewDataset;