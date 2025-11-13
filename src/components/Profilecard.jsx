import React from "react";
import ava1 from "../assets/avatar1.png";
import "../styles/Profilecard.css";

export default function ProfileCard({
  firstName = "",
  lastName = "",
  //name = "",
  age,
  skillLevel,
  avatar = ava1,
}) {
  const displayName = firstName || name || "";

  return (
    <div className="profile-card">
      <div className="profile-image-container">
        <img
          src={avatar}
          alt={displayName ? `${displayName} avatar` : "Profile"}
        />
      </div>
      <h2 className="profile-name">{displayName}</h2>
      {lastName && <p className="profile-text">{lastName}</p>}
      {age !== undefined && age !== null && (
        <p className="profile-text">Age: {age}</p>
      )}
      {skillLevel && <p className="profile-text">Level: {skillLevel}</p>}
      <button className="profile-button">Edit Profile</button>
    </div>
  );
}
