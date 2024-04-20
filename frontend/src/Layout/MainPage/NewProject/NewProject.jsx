import React, { useEffect } from 'react';
import './NewProject.scss';
import Header from '../Header/Header';
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from 'react-router-dom';
import Input2 from '../../../Components/Input2/Input2';
import Button from '../../../Components/Button/Button';

const NewProject = ({ setActiveCallback, toggleMenu }) => {
    useEffect(() => {
        setActiveCallback("projects");
      }, []);

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
                        <Input2 type="text" label="Name" placeholder="e.g. Name"/>
                        <div className='single-line'>
                            <Input2 className="select-network" type="select" label="Neural Network" 
                            options={["Resnet", "Improved Resnet", "Clip"]}
                            tooltips={["1Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus esse quod deleniti dolorum sunt asperiores illo porro suscipit impedit architecto! Nemo necessitatibus quod fugiat eius eos voluptate harum corporis velit!",
                                        "2Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus esse quod deleniti dolorum sunt asperiores illo porro suscipit impedit architecto! Nemo necessitatibus quod fugiat eius eos voluptate harum corporis velit!",
                                        "3Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus esse quod deleniti dolorum sunt asperiores illo porro suscipit impedit architecto! Nemo necessitatibus quod fugiat eius eos voluptate harum corporis velit!"
                                    ]}
                            placeholder="e.g. Name"/>
                            <Input2 type="checkbox" label="Cropping" placeholder="Crop image to recognized object"/>
                        </div>
                        <div className='single-line'>
                            <Input2 type='multi-select' options={["Dataset1", "Dataset2", "Dataset3", "Dataset4"]} label="Datasets"/>
                            <Input2 type='multi-select-2' options={["colorspace", "resize", "flip", "flip"]} label="PostProcessing"/>
                        </div>
                        <Button text="Train"></Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewProject;