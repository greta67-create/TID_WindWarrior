import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import loadSessions from "./components/loadSessions";
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

export default function App() {
  const [user, setUser] = useState(null);
  const { sessions, joinedSessions } = loadSessions();

  useEffect(() => {
    const current = Parse.User.current();
    if (current) {
      setUser(current);
    }
  }, []);

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

  // If not logged in, show login page
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
                sessions={sessions}
                onJoinSession={handleJoinSession}
                joinedSessions={joinedSessions}
              />
            }
          />
          <Route
            path="/session/:id"
            element={
              <SessionViewPage
                sessions={sessions}
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
                sessions={sessions.filter((s) => joinedSessions.includes(s.id))}
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
