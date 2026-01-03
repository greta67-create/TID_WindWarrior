import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";
import { IoPeopleOutline } from "react-icons/io5";

export default function Sessionblocklarge({
  // Fallbacks
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  coastDirection = null,
  avatars = [], // Legacy prop for backwards compatibility
  joinedUsers = [], // Array of user objects with avatar property
  joinedCount = 0, // Total number of joined users
  onJoin = () => {},
  isJoined = false,
  joinedText = "Joined",
}) {
  // Use joinedUsers if available, otherwise fall back to avatars prop
  const userAvatars =
    joinedUsers && joinedUsers.length > 0
      ? joinedUsers.map((u) => u.avatar).filter(Boolean)
      : avatars || [];

  // Show at most 3 avatars
  const list = Array.isArray(userAvatars)
    ? userAvatars
    : userAvatars
    ? [userAvatars]
    : [];
  const shown = list.slice(0, 3);

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
              <svg className="coast-arc" width="70" height="70">
                <path
                  d={
                    coastDirection === "N"
                      ? "M 21 11 A 28 28 0 0 1 49 11"
                      : coastDirection === "NE"
                      ? "M 49 11 A 28 28 0 0 1 59 21"
                      : coastDirection === "E"
                      ? "M 59 21 A 28 28 0 0 1 59 49"
                      : coastDirection === "SE"
                      ? "M 59 49 A 28 28 0 0 1 49 59"
                      : coastDirection === "S"
                      ? "M 49 59 A 28 28 0 0 1 21 59"
                      : coastDirection === "SW"
                      ? "M 21 59 A 28 28 0 0 1 11 49"
                      : coastDirection === "W"
                      ? "M 11 49 A 28 28 0 0 1 11 21"
                      : coastDirection === "NW"
                      ? "M 11 21 A 28 28 0 0 1 21 11"
                      : ""
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

        {joinedCount > 0 ? (
          <div className="avatar-stack">
            {shown.map((src, i) => (
              <img key={i} alt="" src={src} className="avatar" />
            ))}
            {/* Show +N for users without avatars or beyond first 3 */}
            {(joinedCount > shown.length) && (
              <div className="avatar-count">+{joinedCount - shown.length}</div>
            )}
          </div>
        ) : (
          <div className="no-users">
            <IoPeopleOutline />
            <span>0</span>
          </div>
        )}
      </div>
    </div>
  );
}
