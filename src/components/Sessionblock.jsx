import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";
import { IoPeopleOutline } from "react-icons/io5";

export default function Sessionblock({
  // Fallback spot information to avoid weird layout when session info can't be loaded
  spot = "Fallback Spot",
  dateLabel = "Apr 4th",
  timeLabel = "12:00 pm",
  windKts = 21,
  tempC = 18,
  weather = "⛅️",
  windDir = "↗",
  coastDirection = null,
  joinedUsers = [],
  joinedCount = 0, // Total number of joined users
  onJoin = () => {},
  isJoined = false,
  joinedText = "Joined",
  showJoin = true, // Per default show join button (exception: Profileview, past sessions)
}) {
  // Extract avatar URLs from joinedUsers
  const userAvatars =
    joinedUsers && joinedUsers.length > 0
      ? joinedUsers.map((u) => u.avatar).filter(Boolean)
      : [];

  // Show at most 3 avatars
  const list = Array.isArray(userAvatars)
    ? userAvatars
    : userAvatars
    ? [userAvatars]
    : [];
  const shown = list.slice(0, 3);

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
            <div className={`windDir-icon windDir-icon--${windDir}`}>↑</div>
            {/* Curved segment (arc) whose shape depends on coastDirection */}
            <svg className="coast-arc" width="50" height="50">
              <path
                d={
                  coastDirection === "N"
                    ? "M 15 8 A 20 20 0 0 1 35 8"
                    : coastDirection === "NE"
                    ? "M 35 8 A 20 20 0 0 1 42 15"
                    : coastDirection === "E"
                    ? "M 42 15 A 20 20 0 0 1 42 35"
                    : coastDirection === "SE"
                    ? "M 42 35 A 20 20 0 0 1 35 42"
                    : coastDirection === "S"
                    ? "M 35 42 A 20 20 0 0 1 15 42"
                    : coastDirection === "SW"
                    ? "M 15 42 A 20 20 0 0 1 8 35"
                    : coastDirection === "W"
                    ? "M 8 35 A 20 20 0 0 1 8 15"
                    : coastDirection === "NW"
                    ? "M 8 15 A 20 20 0 0 1 15 8"
                    : ""
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
