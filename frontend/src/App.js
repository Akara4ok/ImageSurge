import { React, useState } from 'react';
import SignUpForm from './Layout/SignUpForm/SignUpForm';
import LogInForm from './Layout/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import MainPage from './Layout/MainPage/MainPage';
import Home from './Layout/MainPage/Home/Home';
import "./App.css"
import Projects from './Layout/MainPage/Projects/Projects';
import Datasets from './Layout/MainPage/Datasets/Datasets';
import Settings from './Layout/MainPage/Settings/Settings';
import NewDataset from './Layout/MainPage/NewDataset/NewDataset';
import NewProject from './Layout/MainPage/NewProject/NewProject';
import Inference from './Layout/MainPage/Inference/Inference';


function App() {
  const [active, setActive] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LogInForm />} />
          <Route path="/signup" element={<SignUpForm />} />

          <Route path="/" element={<MainPage active={active} isMenuOpen={isMenuOpen} toggleMenu={()=>setMenuOpen(false)}><Outlet /></MainPage>}>
            <Route index element={<Home setActiveCallback={(text) => { setActive(text) }} toggleMenu={()=>setMenuOpen(true)}/>} />
            <Route path="projects" element={<Projects setActiveCallback={(text) => { setActive(text) }} toggleMenu={()=>setMenuOpen(true)} />} />
            <Route path="datasets" element={<Datasets setActiveCallback={(text) => { setActive(text) }}  toggleMenu={()=>setMenuOpen(true)} />} />
            <Route path="createdataset" element={<NewDataset setActiveCallback={(text) => { setActive(text) }}  toggleMenu={()=>setMenuOpen(true)} />} />
            <Route path="createproject" element={<NewProject setActiveCallback={(text) => { setActive(text) }}  toggleMenu={()=>setMenuOpen(true)} />} />
            <Route path="project" element={<Inference setActiveCallback={(text) => { setActive(text) }}  toggleMenu={()=>setMenuOpen(true)} />} />
            <Route path="settings" element={<Settings setActiveCallback={(text) => { setActive(text) }} toggleMenu={()=>setMenuOpen(true)} />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;