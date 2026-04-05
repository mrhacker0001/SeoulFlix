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
import Require from "./Kdramas/Require";
import AdminDashboard from "./Admin/AdminDashboard";
import MaintenanceNotice from "./MaintenanceNotice";
import FavouritesPage from "./Components/FavouritesPage";
import DonationsPage from "./Kdramas/DonationsPage";
import { Analytics } from "@vercel/analytics/react"

// import SubscriptionPage from "./Components/SubscriptionPage";

function App() {
  const maintenanceMode = true; // test uchun true, realda serverdan yoki env variable bilan boshqarish mumkin

  if (maintenanceMode) return <MaintenanceNotice />;
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
          <Route path="/onlyadmin/adddrama" element={<AdminAddDrama />} />
          <Route path="/onlyadmin/addepisode" element={<AdminAddEpisode />} />
          <Route path="/onlyadmin/editepisode" element={<AdminDashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/require" element={<Require />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          {/* <Route path="/subscription" element={<SubscriptionPage />} /> */}
        </Routes>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
