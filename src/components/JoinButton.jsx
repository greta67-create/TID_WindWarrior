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
    // stop the <Link> on the card from navigating
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(e); // forward the event to onJoin in Feed
    }
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
