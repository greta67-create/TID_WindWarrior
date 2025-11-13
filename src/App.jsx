import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import Parse from "./parse-init";
import SessionFeedPage from "./pages/Feed";
import SessionViewPage from "./pages/SessionView";
import ProfileView from "./pages/Profileview";
import SpotViewPage from "./pages/SpotView";
import Navbar from "./components/Navigationbar";
import MapView from "./pages/MapView";
import Auth from "./pages/LogOn";
import ava1 from "./assets/avatar1.png";
import ava2 from "./assets/avatar2.png";
import ava3 from "./assets/avatar3.png";

export default function App() {
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = Parse.User.current();
    if (current) {
      setUser(current);
    }
  }, []);

  // Local demo data (replace with API later)
  const SESSIONS = [
    {
      id: "1",
      spot: "Amager Strand",
      dateLabel: " 4 Apr",
      timeLabel: "12:00",
      windKts: 21,
      tempC: 18,
      weather: "⛅️",
      windDir: "↗",
    },
    {
      id: "2",
      spot: "Dragør",
      dateLabel: "4 Apr",
      timeLabel: "14:00",
      windKts: 19,
      tempC: 17,
      weather: "🌤️",
      windDir: "↗",
    },
    {
      id: "3",
      spot: "Sydvestpynten",
      dateLabel: "4 Apr",
      timeLabel: "16:00",
      windKts: 17,
      tempC: 16,
      weather: "☀",
      windDir: "↗",
    },
  ];

  // Log on page

  // Pages
  function MapPage() {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title">Map</div>
        </div>
      </div>
    );
  }

  //export default function App() {
  // const [joinedSessions, setJoinedSessions] = React.useState([]);

  const handleJoinSession = (sessionId) => {
    setJoinedSessions((prev) => {
      // If already joined, remove it (toggle functionality)
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId);
      }
      // If not joined, add it
      return [...prev, sessionId];
    });
  };

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // ✅ If not logged in, show login page
  if (!user) {
    return (
      <Router>
        <Auth onLogin={(loggedUser) => setUser(loggedUser)} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <SessionFeedPage
                sessions={SESSIONS}
                onJoinSession={handleJoinSession}
                joinedSessions={joinedSessions}
              />
            }
          />
          <Route
            path="/session/:id"
            element={
              <SessionViewPage
                sessions={SESSIONS}
                onJoinSession={handleJoinSession}
                joinedSessions={joinedSessions}
              />
            }
          />
          <Route path="/map" element={<MapView />} />
          <Route
            path="/profile"
            element={
              <ProfileView
                sessions={SESSIONS.filter((s) => joinedSessions.includes(s.id))}
                onJoinSession={handleJoinSession}
                joinedSessions={joinedSessions}
              />
            }
          />
          <Route path="/spot/:spotName" element={<SpotViewPage />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}
