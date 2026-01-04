import { useState } from "react";
import defaultAvatar from "../assets/Default.png";
import "../styles/Profilecard.css";
import Modal from "./FadedProfile";
import EditProfileModal from "./EditProfile";

// ProfileCard component that displays user profile information

// Props passed from Profileview.jsx
export default function ProfileCard({
  firstName,
  typeofSport,
  age,
  skillLevel,
  avatar = defaultAvatar,
  onSaveProfile = () => {},
}) {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  return (
    <div className="profile-card">
      <div className="profile-image-container">
        <img src={avatar} onError={(e) => (e.target.src = defaultAvatar)} />
      </div>
      <h2 className="profile-name">{firstName}</h2>
      {typeofSport && <p className="profile-text">{typeofSport}</p>}
      {age != null && age !== "" && <p className="profile-text">Age: {age}</p>}
      {skillLevel && <p className="profile-text">Level: {skillLevel}</p>}
      <button className="profile-button" onClick={() => setIsPopUpOpen(true)}>
        Edit Profile
      </button>
      {isPopUpOpen && (
        <Modal onClose={() => setIsPopUpOpen(false)}>
          <EditProfileModal //Renders the EditProfileModal component (which becomes "children" of the Modal component)
            user={{ firstName, typeofSport, age, skillLevel, avatar }}
            onClose={() => setIsPopUpOpen(false)}
            onSave={onSaveProfile} //Passes the onSaveProfile function to EditProfileModal
          />
        </Modal>
      )}
    </div>
  );
}
