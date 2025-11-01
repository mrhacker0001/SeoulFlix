import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DramaList from "./Kdramas/DramaList";
import DramaPage from "./Kdramas/DramaPage";
import Home from "./Kdramas/Home";
import './index.css'
import SearchPage from "./Kdramas/SearchPage";
import Navbar from "./Components/Navbar";
import SignUpPage from "./Sign/SignUpPage";
import SignInPage from "./Sign/SignInPage";
import Profile from "./Sign/Profile";
import Footer from "./Components/Footer";
import HelpPage from "./Kdramas/HelpPage";
import AdminAddDrama from "./Admin/AdminAddDrama";
import AdminAddEpisode from "./Admin/AdminAddEpisode";
import AdminManage from "./Admin/AdminManage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dramalist" element={<DramaList />} />
          <Route path="/drama/:id" element={<DramaPage />} />
          <Route path="/admin/drama" element={<ProtectedRoute><AdminAddDrama /></ProtectedRoute>} />
          <Route path="/admin/episode" element={<ProtectedRoute><AdminAddEpisode /></ProtectedRoute>} />
          <Route path="/admin/manage" element={<ProtectedRoute><AdminManage /></ProtectedRoute>} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
