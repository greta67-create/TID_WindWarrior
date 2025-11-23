import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";

export default function Sessionblock({
  //fallbacks
  spot = "Fallback Spot",
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
  showJoin = true, //per default show join button (exeption: Profileview, past sessions)
}) {
  // show at most 3 avatars
  const list = Array.isArray(avatars) ? avatars : avatars ? [avatars] : [];
  const shown = list.slice(0, 3);
  const more = 3; // calculate the number of additional avatars

  return (
    <div className="session-card">
      <div className="session-header">
        <div className="spot">{spot}</div>
        <div className="subtle">
          {dateLabel} | {timeLabel}
        </div>
        {showJoin && (
          <JoinButton
            isJoined={isJoined}
            onClick={onJoin}
            joinedText={joinedText}
          />
        )}
      </div>

      <div className="session-footer">
        <div className="metrics">
          <div className={`windDir-icon windDir-icon--${windDir}`}>↑</div>
          <div className="metric-text">{windKts} knts</div>
          <div className="weather-type">{getWeatherIcon(weather)}</div>
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
