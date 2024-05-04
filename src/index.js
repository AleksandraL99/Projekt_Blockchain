import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import AddNFT from './components/AddNFT';
import Gallery from './components/Gallery';
import NFTPage from './components/NFTpage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />}/>
        <Route path="/addNFT" element={<AddNFT />}/>
        <Route path="/nftPage/:tokenId" element={<NFTPage />}/>        
        <Route path="/gallery" element={<Gallery />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
