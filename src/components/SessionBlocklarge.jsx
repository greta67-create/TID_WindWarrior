import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";
import { IoPeopleOutline } from "react-icons/io5";
import { getCoastArcPath } from "../utils/getCoastArcPath";

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
  const shownAvatars = userAvatars.slice(0, 3);

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

        {joinedCount > 0 ? (
          <div className="avatar-stack">
            {shownAvatars.map((src, index) => (
              <img key={index} alt="" src={src} className="avatar" />
            ))}
            {/* Show +N for users without avatars or beyond first 3 */}
            {(joinedCount > shownAvatars.length) && (
              <div className="avatar-count">+{joinedCount - shownAvatars.length}</div>
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
