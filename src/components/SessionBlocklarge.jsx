import "../styles/Sessionblock.css";
import JoinButtonlarge from "../components/JoinButtonlarge";
import { Link } from "react-router-dom";

export default function Sessionblocklarge({
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
    <div className="session-card-large">
      <div className="session-card-title">Forecast for your session:</div>
      <div className="session-header">
        {/* <div className="spot">{spot}</div>
        <div className="subtle">
          {dateLabel} | {timeLabel}
        </div> */}

        <div className="metrics">
          <div className="icon-badge-large">{windDir}</div>
          <div className="metric-text-large">{windKts} knts</div>
          <div className="icon-badge-large">{weather}</div>
          <div className="metric-text-large">{tempC}°C</div>
        </div>
      </div>

      <div className="session-footer">
        <JoinButtonlarge
          isJoined={isJoined}
          onClick={onJoin}
          joinedText={joinedText}
        />

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
