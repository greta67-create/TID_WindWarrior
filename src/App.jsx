import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css";
import SessionFeedPage from "./pages/Feed";

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
      <a className="nav-link" href="#" onClick={(e) => e.preventDefault()}>
        Profile
      </a>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SessionFeedPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/map" element={<ProfilePage />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}
