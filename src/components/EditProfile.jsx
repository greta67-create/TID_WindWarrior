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
    file: null, // File object for new uploads
  });

  // useRef is used here to reference a DOM element without triggering a re-render
  const fileInputRef = useRef(null);

  // Handles changing the value of a form field
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Opens the file picker when the pencil icon button is clicked
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handles when the user chooses a new picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      // checks if the file is a picture
      const previewUrl = URL.createObjectURL(file); // this method creates a URL string for preview
      setFormData({ ...formData, file, avatar: previewUrl }); // store File object and preview URL in formData
    }
  };

  // Handles saving the profile
  const handleSave = () => {
    onSave(formData); // Sends updated profile data back to parent (Profileview)
    onClose(); // Closes the profile popup
  };

  return (
    <div className="edit-profile-card">
      <div className="profile-image-section">
        <div className="profile-image-wrapper">
          <img
            src={formData.avatar} // Preview URL string for image so that user can see image before saving
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
          {/* Hidden file input */}
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
