import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SessionFeedPage from "./pages/Feed";
import SessionViewPage from "./pages/SessionView";
import SpotViewPage from "./pages/SpotView";
import ProfileView from "./pages/ProfileView";
import Navbar from "./components/Navigationbar";

import ava1 from "./assets/avatar1.png";
import ava2 from "./assets/avatar2.png";
import ava3 from "./assets/avatar3.png";

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

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SessionFeedPage sessions={SESSIONS} />} />
          <Route
            path="/session/:id"
            element={<SessionViewPage sessions={SESSIONS} />}
          />
          <Route path="/spot/:spotName" element={<SpotViewPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfileView />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}
