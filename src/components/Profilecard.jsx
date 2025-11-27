import React from "react";
import defaultAvatar from "../assets/Default.png";
import "../styles/Profilecard.css";

export default function ProfileCard({
  firstName,
  typeofSport,
  age,
  skillLevel,
  avatar = defaultAvatar,
}) {
  const UserName = firstName;
  const fallbackAvatar = avatar || defaultAvatar;

  return (
    <div className="profile-card">
      <div className="profile-image-container">
        <img
          src={fallbackAvatar}
          alt={UserName}
          onError={(e) => (e.target.src = defaultAvatar)}
        />
      </div>
      <h2 className="profile-name">{UserName}</h2>
      {typeofSport && <p className="profile-text">{typeofSport}</p>}
      {age !== undefined && age !== null && (
        <p className="profile-text">Age: {age}</p>
      )}
      {skillLevel && <p className="profile-text">Level: {skillLevel}</p>}
      <button
        className="profile-button"
        onClick={() => alert("Edit Profile feature coming soon!")}
      >
        Edit Profile
      </button>
    </div>
  );
}
