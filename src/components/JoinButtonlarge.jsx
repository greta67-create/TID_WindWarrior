import React from "react";
import "../styles/Joinbutton.css";

export default function JoinButtonlarge({
  isJoined = false,
  onClick = () => {},
  joinedText = "Joining",
  children = null,
  className = "",
  ...rest
}) {
  const handleClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      className={`join-buttonlarge ${isJoined ? "joined" : ""} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {children ?? (isJoined ? joinedText : "Join")}
    </button>
  );
}
