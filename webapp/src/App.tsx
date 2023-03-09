import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import NavMenu from "./components/NavMenu";

function App() {
  return (
      <div className='App'>
          <BrowserRouter>
              <NavMenu/>
              <Routes>
                <Route path="/" element={<Login /> } />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<h1>Page not found</h1> } />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;
