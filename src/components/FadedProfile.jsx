import React, { useEffect } from "react";
import "../styles/ProfilePopUp.css";

export default function Modal({ children, onClose }) {
  // Close modal when clicking outside content
  const handleBackgroundClick = () => {
    onClose();
  };

  // Prevent closing when clicking inside content
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleBackgroundClick}>
      <div className="modal-content" onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
}