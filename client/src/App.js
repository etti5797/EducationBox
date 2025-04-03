import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Forum from './pages/Forum';
import SharedMaterials from './pages/SharedMaterials';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ChatBotIcon from './components/ChatBotIcon';
import ChatBot from './pages/ChatBot';
import SignUp from './pages/SignUp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UploadFiles from './pages/UploadFiles';
import NotFound from './pages/NotFound';


function App() {
  const [navBarOption, setNavBarOption] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);  
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [auth]); 


  return (
    <BrowserRouter>
    
      <div className="app">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} navBarOption={navBarOption} setNavBarOption={setNavBarOption}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Forum" element={<Forum />} />
          <Route path="/Shared-Materials" element={<SharedMaterials />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/SignUp" element={<SignUp />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/chatBot" element={<ChatBot/>}/>
          <Route path="/upload" element={<UploadFiles/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        <ChatBotIcon setNavBarOption={setNavBarOption}/>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


export default App;

