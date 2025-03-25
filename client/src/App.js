import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Forum from './pages/Forum';
import SharedMaterials from './pages/SharedMaterials';
import Home from './pages/Home';

function App() {
  const [navBarOption, setNavBarOption] = useState("");
  return (
    <BrowserRouter>
    
      <div className="app">
        <Header />
        <Navbar navBarOption={navBarOption} setNavBarOption={setNavBarOption} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Forum" element={<Forum />} />
          <Route path="/Shared-Materials" element={<SharedMaterials />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


export default App;

