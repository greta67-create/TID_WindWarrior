import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";

export default function Sessionblocklarge({
  //fallbacks
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  coastDirection = null,
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
        <div className="metrics">
          <div className="wind-container-large">
            <div className={`windDir-icon-large windDir-icon--${windDir}`}>↑</div>
            {coastDirection && (
              <svg width="70" height="70" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path 
                  d={
                    coastDirection === 'N' ? 'M 21 11 A 28 28 0 0 1 49 11' :
                    coastDirection === 'NE' ? 'M 49 11 A 28 28 0 0 1 59 21' :
                    coastDirection === 'E' ? 'M 59 21 A 28 28 0 0 1 59 49' :
                    coastDirection === 'SE' ? 'M 59 49 A 28 28 0 0 1 49 59' :
                    coastDirection === 'S' ? 'M 49 59 A 28 28 0 0 1 21 59' :
                    coastDirection === 'SW' ? 'M 21 59 A 28 28 0 0 1 11 49' :
                    coastDirection === 'W' ? 'M 11 49 A 28 28 0 0 1 11 21' :
                    coastDirection === 'NW' ? 'M 11 21 A 28 28 0 0 1 21 11' :
                    ''
                  }
                  stroke="green" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
          <div className="metric-text-large">{windKts} knts</div>
          <div className="weather-type-large">{getWeatherIcon(weather)}</div>
          <div className="metric-text-large">{tempC}°C</div>
        </div>
      </div>

      <div className="session-footer">
        <JoinButton
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
