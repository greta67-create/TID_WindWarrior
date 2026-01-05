import { useState, useRef } from "react";
import "../styles/ProfilePopUp.css";
import defaultAvatar from "../assets/Default.png";
import { FaPen } from "react-icons/fa6";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    typeofSport: user.typeofSport || "",
    age: user.age || "",
    skillLevel: user.skillLevel || "",
    avatar: user.avatar || defaultAvatar,
    file: null,
  });

  // useRef is used to reference the hidden file input element
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
      const previewUrl = URL.createObjectURL(file); // this method creates a URL string for preview because we can't directly use the File object as image src
      setFormData({ ...formData, file, avatar: previewUrl }); // store File object and preview URL in formData
    }
  };

  // Handles saving the profile
  const handleSave = () => {
    onSave(formData);
    onClose();
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
            ref={fileInputRef} // ref is used to reference the file input element
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="form-field">
        <label>Name:</label>
        <input //controlled component - the value of the input is controlled by the state of the formData object
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
