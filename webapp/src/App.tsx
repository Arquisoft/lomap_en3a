import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AddPlace from './pages/AddPlace';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
      <div className='App'>
          <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login /> } />
                <Route path="/home" element={<Home />} />
                <Route path="/add-place" element={<AddPlace />} />
                <Route path="*" element={<h1>Page not found</h1> } />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;
