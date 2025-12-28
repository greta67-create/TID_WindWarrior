import { useState, useRef } from "react";
import "../styles/ProfilePopUp.css";
import defaultAvatar from "../assets/Default.png";
import { FaPen } from "react-icons/fa6";

export default function EditProfileModal({ user, onClose, onSave }) {
  // Edit Profile Form
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    typeofSport: user.typeofSport || "",
    age: user.age || "",
    skillLevel: user.skillLevel || "",
    avatar: user.avatar || defaultAvatar,
  });

  // Reference til den skjulte file input
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Åbn fil-vælgeren når edit-knappen klikkes
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Håndter når bruger vælger et nyt billede
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tjek at det er et billede
      if (file.type.startsWith("image/")) {
        // Konverter billedet til en URL for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, avatar: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        alert("Vælg venligst et billede");
      }
    }
  };

  const handleSave = () => {
    onSave(formData); // Send data back to parent
    onClose(); // Close Pop Up
  };

  return (
    <div className="edit-profile-card">
      <div className="profile-image-section">
        <div className="profile-image-wrapper">
          <img
            src={formData.avatar}
            alt="Profile"
            className="profile-image"
            onError={(e) => (e.target.src = defaultAvatar)}
          />
          <button
            className="edit-icon-btn"
            type="button"
            onClick={handleImageClick}
          >
            <FaPen />
          </button>
          {/* Skjult file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="form-field">
        <label>Name:</label>
        <input
          value={formData.firstName}
          onChange={handleChange("firstName")}
        />
      </div>

      <div className="form-field">
        <label>Water Sport:</label>
        <input
          value={formData.typeofSport}
          onChange={handleChange("typeofSport")}
        />
      </div>

      <div className="form-field">
        <label>Age:</label>
        <input
          type="number"
          value={formData.age}
          onChange={handleChange("age")}
        />
      </div>

      <div className="form-field">
        <label>Level:</label>
        <input
          value={formData.skillLevel}
          onChange={handleChange("skillLevel")}
        />
      </div>

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
