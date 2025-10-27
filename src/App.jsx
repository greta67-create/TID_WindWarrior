import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css";
import SessionFeedPage from "./pages/Feed";
import SessionViewPage from "./pages/SessionView";

// Local demo data (replace with API later)
const SESSIONS = [
  {
    id: "1",
    spot: "Amager Strand",
    dateLabel: "Apr 4th",
    timeLabel: "12pm",
    windKts: 21,
    tempC: 18,
    weather: "⛅️",
    windDir: "↗",
  },
  {
    id: "2",
    spot: "Dragør",
    dateLabel: "Apr 4th",
    timeLabel: "2pm",
    windKts: 19,
    tempC: 17,
    weather: "⛅️",
    windDir: "↗",
  },
  {
    id: "3",
    spot: "Sydvestpynten",
    dateLabel: "Apr 4th",
    timeLabel: "4pm",
    windKts: 17,
    tempC: 16,
    weather: "⛅️",
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

function ProfilePage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Profile</div>
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/map"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Map
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Profile
        </NavLink>
      </div>
    </nav>
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
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}
