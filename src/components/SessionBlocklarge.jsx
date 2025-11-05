import "../styles/SessionBlock.css";
import { Link } from "react-router-dom";

export default function SessionBlocklarge({
  //fallbacks
  spot = "Amager Strand",
  dateLabel = "Apr 4th",
  timeLabel = "12pm",
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  avatars = [],
  onJoin = () => {},
  isJoined = false,
  joinedText = "Joining",
}) {
  // show at most 3 avatars
  const list = avatars;
  const shown = list.slice(0, 3);
  const more = 3; // hardcoded for now

  return (
    <div className="session-card">
      <div className="session-header">
        <div className="session-title">
          <div className="spot">{spot}</div>
          <div className="subtle">
            {dateLabel} | {timeLabel}
          </div>
          <button
            className={`join-button ${isJoined ? "joined" : ""}`}
            onClick={onJoin}
          >
            {isJoined ? joinedText : "Join"}
          </button>
        </div>
      </div>

      <div className="session-footer">
        <div className="metrics">
          <div className="icon-badge">{windDir}</div>
          <div className="metric-text">{windKts} knts</div>
          <div className="icon-badge">{weather}</div>
          <div className="metric-text">{tempC}°C</div>
        </div>

        {list.length > 0 && (
          <div className="avatar-stack">
            {shown.map((src, i) => (
              <img key={i} alt="" src={src} className="avatar" />
            ))}
            {more > 0 && <div className="avatar-count">+{more}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
