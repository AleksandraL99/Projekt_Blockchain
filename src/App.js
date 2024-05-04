import './App.css';
import Gallery from './components/Gallery';
import AddNFT from './components/AddNFT';
import NFTPage from './components/NFTpage';
import {Route, Routes,} from "react-router-dom";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<Gallery />}/>
          <Route path="/nftPage" element={<NFTPage />}/>        
          <Route path="/gallery" element={<Gallery />}/>
          <Route path="/addNFT" element={<AddNFT />}/>
        </Routes>
    </div>
  );
}

export default App;
