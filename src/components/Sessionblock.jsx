import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";

import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";

export default function Sessionblock({
  //fallbacks
  spot = "Fallback Spot",
  dateLabel = "Apr 4th",
  timeLabel = "12pm",
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  coastDirection = null,
  avatars = [ava1, ava2, ava3],
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
          <div className="wind-container">
            <div className={`windDir-icon windDir-icon--${windDir}`}>
              ↑
            </div>
            <svg width="50" height="50" style={{ position: 'absolute', top: 0, left: 0 }}>
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
