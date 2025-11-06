import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import { Link } from "react-router-dom";

export default function Sessionblock({
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
  const list = Array.isArray(avatars) ? avatars : avatars ? [avatars] : [];
  const shown = list.slice(0, 3);
  const more = 3; // calculate the number of additional avatars

  return (
    <div className="session-card">
      <div className="session-header">
        <div className="session-title">
          <Link
            to={`/spot/${encodeURIComponent(spot)}`}
            className="spot"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {spot}
          </Link>
          <div className="subtle">
            {dateLabel} | {timeLabel}
          </div>
          <JoinButton
            isJoined={isJoined}
            onClick={onJoin}
            joinedText={joinedText}
          />
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
