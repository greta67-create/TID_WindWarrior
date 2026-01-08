import React from "react";
import "../../styles/JoinButton.css";

export default function JoinButton({
  isJoined = false,
  onClick = () => {},
  joinedText = "Joined",
  children = null,
}) {
  const handleClick = (e) => {
    // Prevent click from bubbling up to parent <Link>
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      type="button"
      className={`join-button ${isJoined ? "joined" : ""}`}
      onClick={handleClick}
    >
      {children ?? (isJoined ? joinedText : "Join")}
    </button>
  );
}
