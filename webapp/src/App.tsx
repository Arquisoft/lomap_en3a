import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from "./components/Layout";

function App() {
  return (
      <div className='App'>
          <BrowserRouter>
              <Routes>
                <Route index element={<Login /> } />
                <Route path="/" element={<Layout /> } >
                    <Route path="/home" element={<Home />} />
                    <Route path="*" element={<h1>Page not found</h1> } />
                </Route>
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;
