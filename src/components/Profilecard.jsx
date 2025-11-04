import React from "react";
import ava1 from "../assets/avatar1.png";
import "../styles/ProfileCard.css";

export default function ProfileCard({ avatar = ava1 }) {
  return (
    <div className="profile-card">
      <div className="profile-image-container">
        <img src={avatar} alt="Profile" />
      </div>
      <h2 className="profile-name">Carl Caterpillar</h2>
      <p className="profile-text">Windsurfer</p>
      <p className="profile-text">Age: 35</p>
      <p className="profile-text">Level: Pro</p>
      <button className="profile-button">Edit Profile</button>
    </div>
  );
}
