import React, { useState, useEffect } from 'react';
import './NewDataset.scss';
import Header from '../Header/Header';
import { MdKeyboardBackspace } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import Input2 from '../../../Components/Input2/Input2';
import Button from '../../../Components/Button/Button';
import { IoSwapHorizontal } from "react-icons/io5";
import axios from 'axios';
import Spinner from '../../../Components/Spinner/Spinner';
import { gdriveValidate } from '../../../utils/Validators.js'
import Popup from '../../../Components/Popup/Popup.jsx';
import FormData from 'form-data';

const NewDataset = ({ setActiveCallback, toggleMenu }) => {
    const [popupMsg, setPopupMsg] = useState();
    const [sucessCreated, setSuccessCreated] = useState(false);
    const [isLoading, setIsLoading] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [swapped, setSwapped] = useState(false);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [file, setFile] = useState();
    const [fileError, setFileError] = useState();
    const [category, setCategory] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [gdriveLink, setGdriveLink] = useState("");
    const [gdriveLinkError, setGdriveLinkError] = useState("");
    const [categoryList, setCategoryList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setActiveCallback("datasets");
        const token = "Bearer " + localStorage.getItem('token');
        axios({
            method: 'get',
            url: 'http://localhost:8000/category/all',
            headers: {
                authorization: token
            }
        }).then((response) => {
            setIsLoading(false);
            const categories = response.data?.categories?.map(category => {
                return category.Name
            });
            setCategoryList(categories ?? []);
        }).catch((error) => {
            setIsLoading(false);
        });
    }, []);

    const onSwap = (event) => {
        event.preventDefault();
        setSwapped(!swapped);
    }

    const validate = () => {
        let gdriveLinkError = gdriveValidate(gdriveLink);
        if(gdriveLinkError && swapped){
            setGdriveLinkError(gdriveLinkError);
        } else {
            setGdriveLinkError("");
        }

        let nameError = "";
        if(!name){
            nameError = "Name is required";
        }
        setNameError(nameError);
        let categoryError = "";
        if(!category){
            categoryError = "Category is required";
        }
        setCategoryError(categoryError);
        let fileError = "";
        if(!file && !swapped){
            fileError = "File is required";
        }
        setFileError(fileError);

        return !((gdriveLinkError && swapped) || nameError || categoryError || (fileError && !swapped))
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if(!validate()){
            return;
        }
        console.log(file)
        const token = "Bearer " + localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('Name', name);
        formData.append('Category', category);
        formData.append('Source', !swapped ? 1 : 4);
        formData.append('GDriveLink', gdriveLink);
        formData.append('File', !swapped ? file : "");
        
        setIsLoading(true);
        axios({
            method: 'post',
            url: 'http://localhost:8000/dataset/',
            headers: {
                authorization: token
            },
            data: formData
        }).then((response) => {
            setIsLoading(false);
            setPopupMsg(response?.data?.message ?? "Undefined Error");
            if(response?.data?.message){
                setSuccessCreated(true);
            } else {
                setSuccessCreated(false);
            }
            setPopupOpen(true);
        }).catch((error) => {
            console.log(error.response)
            setPopupMsg(error.response?.data?.error ?? "Undefined Error");
            setPopupOpen(true);
            setSuccessCreated(false);
            setIsLoading(false);
        });
    }

    const onPopupClose = () => {
        if(sucessCreated){
            setSuccessCreated(false);
            navigate("/datasets")
        }
        setPopupOpen(false)
    }

    return (
        <div className='home-wrapper'>
            <Header text="Datasets" toggleMenu={toggleMenu} />
            <div className='datasets-create-wrapper'>
                <div className='datasets-create-content'>
                    <div className='datasets-create-header'>
                        <Link className="links" to="/datasets"><MdKeyboardBackspace size="40px" /></Link>
                        <p>New Dataset</p>
                    </div>
                    <form>
                        <Input2 type="text" value={name} onChange={setName} errorMsg={nameError} label="Name" placeholder="e.g. Name" />
                        <Input2 className="select-category" onChange={setCategory} errorMsg={categoryError} type="select" label="Category" options={categoryList} placeholder="e.g. Name" />
                        <div className="file-uploader">
                            {
                                !swapped ?
                                    <Input2 value={file} onChange={setFile} type="files" errorMsg={fileError} label="Files" /> :
                                    <Input2 value={gdriveLink} errorMsg={gdriveLinkError} onChange={setGdriveLink} type="text" label="GDrive Link" placeholder="https://drive.google.com/file/d/12345" />
                            }
                            <button onClick={(onSwap)}>
                                <IoSwapHorizontal size={25} />
                            </button>
                        </div>
                        <Button text="Create" onClick={onSubmit}></Button>
                    </form>
                </div>
            </div>
            {isPopupOpen && <Popup message={popupMsg} onClose={onPopupClose} />}
            {isLoading ? <Spinner /> : null}
        </div>
    );
};

export default NewDataset;