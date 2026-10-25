import React, { useContext } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import {Toaster} from 'react-hot-toast';
import { UserContext } from './context/userContext.jsx';
import Navbar from './pages/Navbar.jsx';
import Home from './pages/Home.jsx';
import MediaGallery from './components/MediaGallrey.jsx';

const App = () => {
  const { isAuth} = useContext(UserContext);
  return (
    <div className="min-h-screen bg-[#131418] text-white selection:bg-[#38bdf8] selection:text-black">
    <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
    <Route path="/" element={<Register />}/>
    <Route path="/home" element={isAuth ? <Home/> : <Register />}/>
    <Route path="/profile" element={isAuth ? <Profile/> : <Register />}/>
    <Route path="/media" element={isAuth ? <MediaGallery/> : <Register />}/>
    </Routes>    
    </BrowserRouter>
    </div>
  )
}

export default App
