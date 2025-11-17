import React from "react";
import defaultAvatar from "../assets/Default.png";
import "../styles/Profilecard.css";

export default function ProfileCard({
  firstName = "",
  lastName = "",
  age,
  skillLevel,
  avatar = defaultAvatar,
}) {
  const displayName = firstName || "User";
  const safeAvatar = avatar || defaultAvatar;

  return (
    <div className="profile-card">
      <div className="profile-image-container">
        <img
          src={safeAvatar}
          alt={displayName ? `${displayName} avatar` : "Profile"}
          onError={(e) => (e.target.src = defaultAvatar)} // If the profile doesn't have a picture
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
