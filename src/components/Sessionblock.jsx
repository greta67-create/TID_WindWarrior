import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";

export default function Sessionblock({
  //fallback spot information to avoid weird layout when session onfpr can't be loaded
  spot = "Fallback Spot",
  dateLabel = "Apr 4th",
  timeLabel = "12:00 pm",
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  coastDirection = null,
  avatars = [],
  onJoin = () => {},
  isJoined = false,
  joinedText = "Joined",
  showJoin = true, //per default show join button (exeption: Profileview, past sessions)
}) {
  // show at most 3 avatars
  const avatarList = Array.isArray(avatars) ? avatars : avatars ? [avatars] : [];
  const shownAvatars = avatarList.slice(0, 3);
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
          <div className="wind-container">
            <div className={`windDir-icon windDir-icon--${windDir}`}>
              ↑
            </div>
            {/* curved segment (arc) whose shape depends on costDirection attribute */}
            <svg className="coast-arc"width="50" height="50">
              <path 
                d={
                  coastDirection === 'N' ? 'M 15 8 A 20 20 0 0 1 35 8' :
                  coastDirection === 'NE' ? 'M 35 8 A 20 20 0 0 1 42 15' :
                  coastDirection === 'E' ? 'M 42 15 A 20 20 0 0 1 42 35' :
                  coastDirection === 'SE' ? 'M 42 35 A 20 20 0 0 1 35 42' :
                  coastDirection === 'S' ? 'M 35 42 A 20 20 0 0 1 15 42' :
                  coastDirection === 'SW' ? 'M 15 42 A 20 20 0 0 1 8 35' :
                  coastDirection === 'W' ? 'M 8 35 A 20 20 0 0 1 8 15' :
                  coastDirection === 'NW' ? 'M 8 15 A 20 20 0 0 1 15 8' :
                  ''
                }
                stroke="green" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="metric-text">{windKts} knts</div>
          <div className="weather-type">{getWeatherIcon(weather)}</div>
          <div className="metric-text">{tempC}°C</div>
        </div>
        {/* show avatars if there are any */}
        {avatarList.length > 0 && (
          <div className="avatar-stack">
            {shownAvatars.map((src, i) => (
              <img key={i} alt="" src={src} className="avatar" />
            ))}
            {/* if there are more avatars, show the number of additional avatars */}
            {more > 0 && <div className="avatar-count">+{more}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
