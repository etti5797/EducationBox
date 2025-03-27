import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Forum from './pages/Forum';
import SharedMaterials from './pages/SharedMaterials';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ChatBotIcon from './components/ChatBotIcon';
import ChatBot from './pages/ChatBot';


function App() {
  const [navBarOption, setNavBarOption] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
    
      <div className="app">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setNavBarOption={setNavBarOption}/>
        <Navbar navBarOption={navBarOption} setNavBarOption={setNavBarOption} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Forum" element={<Forum />} />
          <Route path="/Shared-Materials" element={<SharedMaterials />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/chatBot" element={<ChatBot/>}/>
        </Routes>
        <ChatBotIcon setNavBarOption={setNavBarOption}/>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


export default App;

