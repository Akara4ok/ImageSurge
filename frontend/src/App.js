import { React, useState } from 'react';
import SignUpForm from './Layout/SignUpForm/SignUpForm';
import LogInForm from './Layout/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import MainPage from './Layout/MainPage/MainPage';
import Home from './Layout/MainPage/Home/Home';
import "./App.css"
import Projects from './Layout/MainPage/Projects/Projects';


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
            <Route path="datasets" element={<Home setActiveCallback={(text) => { setActive(text) }}  toggleMenu={()=>setMenuOpen(true)} />} />
            <Route path="settings" element={<Home setActiveCallback={(text) => { setActive(text) }} toggleMenu={()=>setMenuOpen(true)} />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;