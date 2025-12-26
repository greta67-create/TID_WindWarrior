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
  joinedText = "Joined",
}) {
  // show at most 3 avatars
  const avatarList = Array.isArray(avatars) ? avatars : avatars ? [avatars] : [];
  const shownAvatars = avatarList.slice(0, 3);
  const more = 3; // calculate the number of additional avatars

  //  adapted structure compared to normal Sessionblock (new structure and larger icons)
  return (
    <div className="session-card">
      <div className="session-card-title">Forecast for your session:</div>
      <div className="session-header">
        <div className="metrics">
          <div className="wind-container-large">
            <div className={`windDir-icon-large windDir-icon--${windDir}`}>↑</div>
            {coastDirection && (
              //curved segment (arc) whose shape depends on costDirection attribute
              <svg className="coast-arc" width="70" height="70">
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
        {/* show avatars if there are any */}
        {avatarList.length > 0 && (
          <div className="avatar-stack">
            {shownAvatars.map((avatar, index) => (
              <img key={index} alt="" src={avatar} className="avatar" />
            ))}
            {/* if there are more avatars, show the number of additional avatars */}
            {more > 0 && <div className="avatar-count">+{more}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
