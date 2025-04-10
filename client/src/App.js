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
import Question from './pages/Question';
import AddQuestion from './pages/AddQuestion';
import AnswerQuestion from './pages/AnswerQuestion';
import MyCalendar from './components/MyCalendar';


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
          <Route path="/forum" element={<Forum />} />
          <Route path="/question/:id" element={<Question/>} />
          <Route path="/question/:id/answer" element={<AnswerQuestion/>}/>
          <Route path="/add-question" element={<AddQuestion/>}/>
          <Route path="/shared-materials" element={<SharedMaterials />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/signUp" element={<SignUp />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/chatBot" element={<ChatBot/>}/>
          <Route path="/upload" element={<UploadFiles/>}/>
          <Route path="/myCalendar" element={<MyCalendar/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        <ChatBotIcon setNavBarOption={setNavBarOption}/>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


export default App;

