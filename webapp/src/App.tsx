import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Friends from './pages/Friends';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from "./components/Layout";
import PrivateRoute from "./components/CustomRoute";

function App() {
  return (
      <div className='App'>
          <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login /> } />
                <Route element={<PrivateRoute /> } >
                    <Route path="/" element={<Layout /> } >
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/map/personal" element={<Home/>}/>
                        <Route path="/friends" element={<Friends />}/>
                        <Route path="/map/public" element={<Home/>}/>
                        <Route element={<PrivateRoute /> } >
                            <Route path="*" element={<h1>Page not found</h1> } />
                        </Route>
                    </Route>
                </Route>
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;