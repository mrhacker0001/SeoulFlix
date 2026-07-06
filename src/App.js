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
// import DonationsPage from "./Kdramas/DonationsPage";
import { Analytics } from "@vercel/analytics/react"
import Notifications from "./Kdramas/Notifications";
import OnlyAdminNotification from "./Kdramas/OnlyAdminNotification";
import FeedbackPage from "./Kdramas/FeedbackPage";
import SubscriptionPage from "./Components/SubscriptionPage";

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

  // const openInBrowser = () => {
  //   const url = window.location.href;

  //   // Android uchun Chrome ochish
  //   if (/Android/i.test(navigator.userAgent)) {
  //     window.location.href =
  //       `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
  //   }

  //   // iPhone uchun Safari
  //   else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  //     window.location.href = url;
  //   }

  //   // Oddiy browser
  //   else {
  //     window.open(url, "_blank");
  //   }
  // };

  if (maintenanceMode) return <MaintenanceNotice />;

  return (
    <Router>

      {/* TELEGRAM WARNING */}
      {/* TELEGRAM WARNING */}
      {isTelegram && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: "#000",
            zIndex: 999999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "420px",
              background: "#111",
              borderRadius: "24px",
              padding: "30px 20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 40px rgba(0,0,0,0.7)",
            }}
          >
            <h1
              style={{
                color: "#fff",
                fontSize: "24px",
                marginBottom: "15px",
                fontWeight: "700",
              }}
            >
              Telegram Browser Aniqladi
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                lineHeight: "1.7",
                fontSize: "15px",
              }}
            >
              Video player va ayrim funksiyalar
              Telegram ichida to‘liq ishlamaydi.
              Saytni Chrome yoki Safari orqali oching.
            </p>

            <button
              onClick={() => {
                const url = window.location.href;

                // Android
                if (/Android/i.test(navigator.userAgent)) {
                  window.location.href =
                    `intent://${url.replace(
                      /^https?:\/\//,
                      ""
                    )}#Intent;scheme=https;package=com.android.chrome;end`;
                }

                // iPhone
                else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                  window.location.href = url;
                }

                // Desktop
                else {
                  window.open(url, "_blank");
                }
              }}
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#229ED9",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Chrome orqali ochish
            </button>
          </div>
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
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/onlyadminnotif" element={<OnlyAdminNotification />} />
          <Route path="/premium" element={<SubscriptionPage />} />
        </Routes>

        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;