import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import loadSessions from "./components/loadSessions";
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
import { getList } from "../backend/getParseFunctions";

export default function App() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      const sessionQuery = new Parse.Query("Session_");
      sessionQuery.include("spotId");
      try {
        const sessionData = await getList(sessionQuery);
        const normalized = sessionData.map((s) => ({
          ...s,
          id: s.objectId, // use Parse objectId as our id
        }));

        setSessions(normalized);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
      //   setSessions(sessionData);
      // } catch (error) {
      //   console.error("Error fetching sessions:", error);
      // }
    };

    loadSessions();
  }, []);

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
