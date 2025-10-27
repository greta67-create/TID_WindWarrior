import React from "react";
import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { GrMapLocation } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";
import "./Navigationbar.css";

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
            <GoHomeFill size={24} />
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink
            to="/map"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <GrMapLocation size={24} />
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <IoPersonSharp size={24} />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
