import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Forum from './pages/Forum';
import SharedMaterials from './pages/SharedMaterials';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ChatBotIcon from './components/ChatBotIcon';
import ChatBot from './pages/ChatBot';
import UploadFiles from './pages/UploadFiles';
import NotFound from './pages/NotFound';
import Question from './pages/Question';
import AddQuestion from './pages/AddQuestion';
import AnswerQuestion from './pages/AnswerQuestion';
import MyCalendar from './components/MyCalendar';
import ToDoList from './components/ToDoList';
import ReplyComment from './pages/ReplyComment';



function App() {
  const [navBarOption, setNavBarOption] = useState("");

  return (
    <BrowserRouter>
    
      <div className="app">
        <Header navBarOption={navBarOption} setNavBarOption={setNavBarOption}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/question/:id" element={<Question/>} />
          <Route path="/question/:id/answer" element={<AnswerQuestion/>}/>
          <Route path="question/:id/answer/:answerId/comment" element={<ReplyComment/>}/>
          <Route path="/add-question" element={<AddQuestion/>}/>
          <Route path="/shared-materials" element={<SharedMaterials />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/chatBot" element={<ChatBot/>}/>
          <Route path="/upload" element={<UploadFiles/>}/>
          <Route path="/myCalendar" element={<MyCalendar/>}/>
          <Route path="/todo-list" element={<ToDoList/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        <ChatBotIcon setNavBarOption={setNavBarOption}/>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


export default App;

