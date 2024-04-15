import React, { useEffect } from 'react';
import './Home.scss';
import Header from '../Header/Header';
import FAQAccordion from '../../../Components/FAQAccordion/FAQAccordion';

const Home = ({ setActiveCallback, toggleMenu }) => {
    useEffect(() => {
        setActiveCallback("home");
      }, []);

    const faqs = [
    {
        title: "What is React?",
        content: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called 'components'."
    },
    {
        title: "Why use React?",
        content: "React is used to build single-page applications where you need a fast user interface with state management and modular components. It is maintained by Facebook and a community of individual developers and companies."
    },
    {
        title: "How do you use React?",
        content: "You use React by creating components, either in JavaScript or TypeScript, and using them to build a dynamic user interface. React uses a declarative paradigm that makes it easier to reason about your application and aims to be both efficient and flexible."
    }
    ];

    return (
        <div className='home-wrapper'>
            <Header text="Home" toggleMenu={toggleMenu}/>
            <div className='home-content'>
                <div className='button-wrapper'>
                    <button>+ New Dataset</button>
                    <button>+ New Project</button>
                </div>
                <FAQAccordion faqs={faqs} />
            </div>
        </div>
    );
};

export default Home;