import React, { useState } from "react";
import defaultAvatar from "../assets/Default.png";
import "../styles/Profilecard.css";
import Modal from "./FadedProfile";
import EditProfileModal from "./EditProfile";

export default function ProfileCard({
  firstName,
  typeofSport,
  age,
  skillLevel,
  avatar = defaultAvatar,
  onSaveProfile,
}) {
  const UserName = firstName;
  const fallbackAvatar = avatar || defaultAvatar;
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

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
      <button className="profile-button" onClick={() => setIsPopUpOpen(true)}>
        Edit Profile
      </button>
      {isPopUpOpen && (
        <Modal onClose={() => setIsPopUpOpen(false)}>
          <EditProfileModal
            user={{ firstName, typeofSport, age, skillLevel, avatar }}
            onClose={() => setIsPopUpOpen(false)}
            onSave={onSaveProfile}
          />
        </Modal>
      )}
    </div>
  );
}
