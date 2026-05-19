import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

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
import Notifications from "./Kdramas/Notifications";
import OnlyAdminNotification from "./Kdramas/OnlyAdminNotification";

function App() {

  const maintenanceMode = false;

  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    const telegram =
      typeof window !== "undefined" &&
      (
        typeof window.TelegramWebview !== "undefined" ||
        typeof window.TelegramWebviewProxy !== "undefined" ||
        navigator.userAgent.includes("Telegram")
      );

    setIsTelegram(telegram);
  }, []);

  const openInBrowser = () => {
    window.open(window.location.href, "_blank");
  };

  if (maintenanceMode) return <MaintenanceNotice />;

  return (
    <Router>

      {/* TELEGRAM WARNING */}
      {isTelegram && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "420px",
            background: "#111",
            color: "#fff",
            padding: "20px",
            borderRadius: "18px",
            zIndex: 999999,
            textAlign: "center",
            boxShadow: "0 0 25px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <h2
            style={{
              marginBottom: "10px",
              fontSize: "20px",
              fontWeight: "700"
            }}
          >
            Telegram ichida ochildi
          </h2>

          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.5",
              opacity: 0.9
            }}
          >
            Saytning ayrim funksiyalari Telegram browserida
            to‘liq ishlamasligi mumkin.
            Chrome yoki Safari orqali oching.
          </p>

          <button
            onClick={openInBrowser}
            style={{
              marginTop: "15px",
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "#229ED9",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Browserda ochish
          </button>
        </div>
      )}

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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/onlyadminnotif" element={<OnlyAdminNotification />} />
        </Routes>

        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;