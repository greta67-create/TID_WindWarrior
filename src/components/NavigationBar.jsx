import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import "../styles/Navigationbar.css";

// Navbar component for navigation between Home, Map, and Profile pages
export default function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            end
          >
            <GoHomeFill />
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink
            to="/map"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaMapMarkedAlt />
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <IoPersonSharp />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
