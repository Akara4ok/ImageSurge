import React, { useEffect, useState } from 'react';
import './NewProject.scss';
import Header from '../Header/Header';
import { MdKeyboardBackspace } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import Input2 from '../../../Components/Input2/Input2';
import Button from '../../../Components/Button/Button';
import axios from 'axios';
import Spinner from '../../../Components/Spinner/Spinner';
import Popup from '../../../Components/Popup/Popup';

const NewProject = ({ setActiveCallback, toggleMenu }) => {
    const [popupMsg, setPopupMsg] = useState();
    const [sucessCreated, setSuccessCreated] = useState(false);
    const [isLoading, setIsLoading] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [modelList, setModelList] = useState([]);
    const [datasetList, setDatasetList] = useState([]);

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [model, setModel] = useState("");
    const [modelError, setModelError] = useState("");
    const [datasets, setDatasets] = useState([]);
    const [datasetError, setDatasetError] = useState("");
    const [cropping, setCropping] = useState(false);
    const [postprocessings, setPostprocessings] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        setActiveCallback("projects");
        setIsLoading(true);
        const token = "Bearer " + localStorage.getItem('token');
        getModelsInfo(token);
        getDatasetInfo(token);
    }, []);

        

    const getModelsInfo = (token) => {
        axios({
            method: 'get',
            url: 'http://localhost:8000/model/all',
            headers: {
                authorization: token
            }
        }).then((response) => {
            setIsLoading(false);
            const models = response.data?.models?.map(model => {
                return { 
                    name: model.Name, 
                    desc: model.Description
                };
            });
            setModelList(models ?? []);
        }).catch((error) => {
            setIsLoading(false);
            setPopupMsg(error.response?.data ?? "Undefined Error");
            setPopupOpen(true);
        });
    }

    const getDatasetInfo = (token) => {
        axios({
            method: 'get',
            url: 'http://localhost:8000/user/datasets/',
            headers: {
              authorization: token
            }
          }).then((response) => {
              setIsLoading(false);
              const datasets = response.data?.datasets?.map(dataset => {
                return {
                  id: dataset.Id,
                  name: dataset.Name,
                  category: dataset.Category.Name,
                }
              });
            setDatasetList(datasets ?? []);
          }).catch((error) => {
            setIsLoading(false);
            setPopupMsg(error.response?.data ?? "Undefined Error");
            setPopupOpen(true);
          });
    }

    const validate = () => {
        let nameError = "";
        if(!name){
            nameError = "Name is required";
        }
        setNameError(nameError);
        let modelError = "";
        if(!model){
            modelError = "Category is required";
        }
        setModelError(modelError);
        let datasetError = "";
        if(!datasets || datasets.length === 0){
            datasetError = "Dataset is required";
        }
        setDatasetError(datasetError);

        return !(modelError || nameError || datasetError)
    }

    const categoryDatasetFilter = (filteredDatasets, selected) => {
        if (!selected || selected.length === 0) {
            return filteredDatasets
        }
        
        const findCategory = (name) => {return datasetList.find((dataset) => dataset.name === name).category}

        const category = findCategory(selected[0]);

        return filteredDatasets.filter(datasetName => {
                if(findCategory(datasetName) === category){
                    return true;
                } else {
                    return false;
                }
            }
        )
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if(!validate()){
            return;
        }

        const postprocessingStrArr = postprocessings.map(postprocessing => {
            return (postprocessing.name + " " + postprocessing.param1 + " " + postprocessing.param2).trim()
        })
        const token = "Bearer " + localStorage.getItem('token');
        const datasetsId = datasets.map(datasetName => {
            return datasetList.find(dataset => datasetName === dataset.name)?.id
        })
        setIsLoading(true);
        axios({
            method: 'post',
            url: 'http://localhost:8000/project/',
            headers: {
                authorization: token
            },
            data: {
                Name: name,
                Cropping: cropping,
                NeuralNetworkName: model,
                Datasets: datasetsId,
                Postprocessings: postprocessingStrArr
            }
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
            navigate("/projects");
        }
        setPopupOpen(false)
    }

    return (
        <div className='home-wrapper'>
            <Header text="Projects" toggleMenu={toggleMenu}/>
            <div className='projects-create-wrapper'>
                <div className='projects-create-content'>
                    <div className='projects-create-header'>
                        <Link className="links" to="/projects"><MdKeyboardBackspace size="40px"/></Link>
                        <p>New Project</p>
                    </div>
                    <form>
                        <Input2 type="text" label="Name" onChange={setName} errorMsg={nameError} placeholder="e.g. Name"/>
                        <div className='single-line'>
                            <Input2 className="select-network" onChange={setModel} errorMsg={modelError} type="select" label="Neural Network" 
                            options={modelList?.map(model => {return model.name; })}
                            tooltips={modelList?.map(model => {return model.desc; })}
                            placeholder="e.g. Name"/>
                            <Input2 type="checkbox" onChange={setCropping} label="Cropping" placeholder="Crop image to recognized object"/>
                        </div>
                        <div className='single-line'>
                            <Input2 type='multi-select' onChange={setDatasets} customFilter={categoryDatasetFilter} errorMsg={datasetError} options={datasetList?.map(dataset => {return dataset.name; })} label="Datasets"/>
                            <Input2 type='multi-select-2' onChange={setPostprocessings} 
                            options={["colorspace", "resize", "flip H", "flip V", "rotate", "blur"]} label="PostProcessing"/>
                        </div>
                        <Button text="Train" onClick={onSubmit}></Button>
                    </form>
                </div>
            </div>
            {isPopupOpen && <Popup message={popupMsg} onClose={onPopupClose} />}
            {isLoading ? <Spinner/> : null}
        </div>
    );
};

export default NewProject;