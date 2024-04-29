import { React, useState, useEffect } from 'react';
import SignUpForm from './Layout/SignUpForm/SignUpForm';
import LogInForm from './Layout/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes, Outlet, useNavigate, useLocation } from 'react-router-dom';
import MainPage from './Layout/MainPage/MainPage';
import Home from './Layout/MainPage/Home/Home';
import "./App.css";
import Projects from './Layout/MainPage/Projects/Projects';
import Datasets from './Layout/MainPage/Datasets/Datasets';
import Settings from './Layout/MainPage/Settings/Settings';
import NewDataset from './Layout/MainPage/NewDataset/NewDataset';
import NewProject from './Layout/MainPage/NewProject/NewProject';
import Inference from './Layout/MainPage/Inference/Inference';
import { jwtDecode } from "jwt-decode";
import {socket} from './utils/socket'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <RouterComponent />
      </div>
    </BrowserRouter>
  );
}

function RouterComponent() {
  const [active, setActive] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token  && location.pathname !== '/signup'){
      navigate('/login');
      return;
    }
    if(!token){
      return;
    }
    const decodedToken = jwtDecode(token);
    let currentDate = new Date();
    if (decodedToken.exp * 1000 < currentDate.getTime() && location.pathname !== '/signup') {
      navigate('/login');
    }
    socket.emit('authenticate', token)
  }, [navigate, location.pathname]); // Include location.pathname in the dependency array

  return (
    <Routes>
      <Route path="/login" element={<LogInForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/" element={<MainPage active={active} isMenuOpen={isMenuOpen} toggleMenu={() => setMenuOpen(false)}><Outlet /></MainPage>}>
        <Route index element={<Home setActiveCallback={(text) => setActive(text)} toggleMenu={() => setMenuOpen(true)} />} />
        <Route path="projects" element={<Projects setActiveCallback={(text) => setActive(text)} toggleMenu={() => setMenuOpen(true)} />} />
        <Route path="datasets" element={<Datasets setActiveCallback={(text) => setActive(text)} toggleMenu={() => setMenuOpen(true)} />} />
        <Route path="createdataset" element={<NewDataset setActiveCallback={(text) => setActive(text)} toggleMenu={() => setMenuOpen(true)} />} />
        <Route path="createproject" element={<NewProject setActiveCallback={(text) => setActive(text)} toggleMenu={() => setMenuOpen(true)} />} />
        <Route path="project" element={<Inference setActiveCallback={(text) => setActive(text)} toggleMenu={() => setMenuOpen(true)} />} />
        <Route path="settings" element={<Settings setActiveCallback={(text) => setActive(text)} toggleMenu={() => setMenuOpen(true)} />} />
      </Route>
    </Routes>
  );
}

export default App;