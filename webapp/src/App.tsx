import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from "./components/Layout";
import React from "react";
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
