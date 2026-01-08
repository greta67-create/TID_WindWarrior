import "../../styles/Sessionblock.css";
import JoinButton from "./JoinButton";
import getWeatherIcon from "../../utils/getWeatherIcon";
import { getCoastArcPath } from "../../utils/getCoastArcPath";
import AvatarStack from "./AvatarStack";

export default function Sessionblocklarge({
  // Fallbacks
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  coastDirection = null,
  joinedUsers = [], // Array of user objects with avatar property
  joinedCount = 0, // Total number of joined users
  onJoin = () => {},
  isJoined = false,
  joinedText = "Joined",
}) {
  // Adapted structure compared to normal Sessionblock (new structure and larger icons)
  return (
    <div className="session-card">
      <div className="session-card-title">Forecast for your session:</div>
      <div className="session-header">
        <div className="metrics">
          <div className="wind-container-large">
            <div className={`windDir-icon-large windDir-icon--${windDir}`}>↑</div>
            {coastDirection && (
              // Curved segment (arc) whose shape depends on coastDirection
              <svg className="coast-arc">
                <path d={getCoastArcPath(coastDirection, "large")} />
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

        <AvatarStack joinedUsers={joinedUsers} joinedCount={joinedCount} />
      </div>
    </div>
  );
}
