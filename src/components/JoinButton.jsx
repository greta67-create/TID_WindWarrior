import React from "react";
import "../styles/JoinButton.css";

export default function JoinButton({
  isJoined = false,
  onClick = () => {},
  joinedText = "Joined",
  children = null,
  className = "",
  ...rest
}) {
  const handleClick = (e) => {
    // Prevent click from bubbling up to parent <Link>
    e.stopPropagation();
    onClick(e);
  };

  return (
    <button
      type="button"
      className={`join-button ${isJoined ? "joined" : ""} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {children ?? (isJoined ? joinedText : "Join")}
    </button>
  );
}
