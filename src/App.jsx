import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Parse from "./parse-init";
import SessionFeedPage from "./pages/Feed";
import SessionViewPage from "./pages/SessionView";
import ProfileView from "./pages/Profileview";
import SpotViewPage from "./pages/SpotView";
import Navbar from "./components/NavigationBar";
import MapView from "./pages/MapView";
import Auth from "./pages/LogOn";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = Parse.User.current();
    if (current) {
      setUser(current);
    }
  }, []);

  // log out-function (lambda) - uses authService to keep logic centralized
  // Here we could have made errors more visible to the user
  const onLogout = async () => {
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

  return (
    <Router>
      {" "}
      {/* 1. Wrap everything in Router  - enables routing in the app*/}
      <div className="app">
        <Routes>
          {" "}
          {/* 2. Container for all routes */}
          {/* 3. Each Route maps a URL to a component */}
          <Route path="/" element={<SessionFeedPage />} />
          <Route path="/session/:id" element={<SessionViewPage />} />
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
