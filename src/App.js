import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DramaList from "./Kdramas/DramaList";
import DramaPage from "./Kdramas/DramaPage";
import AdminUpload from "./Admin/AdminUpload";
import Home from "./Kdramas/Home";
import './index.css'
import SearchPage from "./Kdramas/SearchPage";
import Navbar from "./Components/Navbar";
import SignUpPage from "./Sign/SignUpPage";
import SignInPage from "./Sign/SignInPage";
import Profile from "./Sign/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dramalist" element={<DramaList />} />
        <Route path="/drama/:videoId" element={<DramaPage />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;
