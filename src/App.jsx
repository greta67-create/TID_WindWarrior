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
import { fetchAllSessions, fetchUserSessions } from "./services/sessionService";

export default function App() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);

  useEffect(() => {
    async function loadSessions() {
      try {
        const sessionData = await fetchAllSessions();
        setSessions(sessionData);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    }

    loadSessions();
  }, []);

  useEffect(() => {
    const current = Parse.User.current();
    if (current) {
      setUser(current);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchUserSessions(user)
      .then(setJoinedSessions)
      .catch((err) => console.error("Error fetching user sessions:", err));
  }, [user]);

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

  if (!user) {
    return (
      <Router>
        <Auth onLogin={(loggedUser) => setUser(loggedUser)} />
      </Router>
    );
  }

  console.log("Sessions in App.jsx:", sessions);

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
                onJoinSession={handleJoinSession}
                joinedSessions={joinedSessions}
                currentUser={user}
              />
            }
          />
          <Route path="/map" element={<MapView />} />
          <Route
            path="/profile"
            element={
              <ProfileView
                onLogout={handleLogout}
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
