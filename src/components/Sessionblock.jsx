import "./Sessionblock.css";

export default function Sessionblock({
  //fallbacks
  spot = "Amager Strand",
  dateLabel = "Apr 4th",
  timeLabel = "12pm",
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  onJoin = () => {},
}) {
  return (
    <div className="session-card">
      <div className="session-header">
        <div className="session-title">
          <div className="spot">{spot}</div>
          <div className="subtle">
            {dateLabel} | {timeLabel}
          </div>
        </div>
        <button className="join-button" onClick={onJoin}>
          Join
        </button>
      </div>

      <div className="session-footer">
        <div className="metric">
          <div className="icon-badge">{windDir}</div>
          <div className="metric-text">{windKts} knts</div>
          <div className="icon-badge">{weather}</div>
          <div className="metric-text">🌡️{tempC}°C</div>
        </div>
        <div className="avatars" aria-label="participants">
          👤👤
        </div>
      </div>
    </div>
  );
}
