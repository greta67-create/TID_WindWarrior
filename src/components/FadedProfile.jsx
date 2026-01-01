import "../styles/ProfilePopUp.css";

export default function Modal({ children, onClose }) {
  // Close modal when clicking outside content
  //children is a special prop that is passed to the component and can be used to render what is inside the modal
  const handleBackgroundClick = () => {
    onClose();
  };

  // Prevent closing when clicking inside content
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={handleBackgroundClick}>
      <div className="modal-content" onClick={stopPropagation}>
        {children} {/* Renders the content of the modal */}
      </div>
    </div>
  );
}
