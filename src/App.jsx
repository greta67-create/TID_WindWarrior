import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import Parse from "./parse-init";
import SessionFeedPage from "./pages/Feed";
import SessionViewPage from "./pages/SessionView";
import ProfileView from "./pages/Profileview";
import SpotViewPage from "./pages/SpotView";
import Navbar from "./components/NavigationBar";
import MapView from "./pages/MapView";
import Auth from "./pages/LogOn";
import { fetchUserSessions } from "./services/usersessionService";
import { fetchAllSessions } from "./services/sessionService";
import { logOut } from "./services/authService";

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

  // logic to show login page if not logged in
  if (!user) {
    return (
      <Router>
        <Auth onLogin={(loggedUser) => setUser(loggedUser)} />
      </Router>
    );
  }

  // log out-function - uses authService to keep logic centralized
  const onLogout = async () => {
    try {
      await logOut(); // Call the service function
      setUser(null); // Clear user state in App
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

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SessionFeedPage sessions={sessions} />} />
          <Route
            path="/session/:id"
            element={<SessionViewPage joinedSessions={joinedSessions} />}
          />
          <Route path="/map" element={<MapView />} />
          <Route
            path="/profile"
            element={<ProfileView onLogout={onLogout} />}
          />
          <Route path="/spot/:spotName" element={<SpotViewPage />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}
