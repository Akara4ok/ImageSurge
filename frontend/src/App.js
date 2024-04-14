import React from 'react';
import SignUpForm from './Layout/SignUpForm/SignUpForm';
import LogInForm from './Layout/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<SignUpForm/>} />
          <Route path="/signup" exact element={<SignUpForm/>} />
          <Route path="/login" exact element={<LogInForm/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
