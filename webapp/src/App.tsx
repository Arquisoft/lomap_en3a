import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Social from './pages/Social';
import MapView from './pages/MapView';
import Login from './pages/Login';
import Layout from "./components/Layout";
import PrivateRoute from "./components/CustomRoute";
import UserStuff from "./pages/UserStuff";
import PublicMapView from './pages/PublicMapView';

function App() {
  return (
      <div className='App'>
          <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login /> } />
                <Route element={<PrivateRoute /> } >
                    <Route path="/" element={<Layout /> } >
                        <Route path="/home" element={<MapView/>}/>
                        <Route path="/social" element={<Social />}/>
                        <Route path="/map/public" element={<PublicMapView />}/>
                        <Route path="/stuff" element={<UserStuff/>}/>
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