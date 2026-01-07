import "../styles/Sessionblock.css";
import JoinButton from "../components/JoinButton";
import getWeatherIcon from "../utils/getWeatherIcon";
import { IoPeopleOutline } from "react-icons/io5";
import { getCoastArcPath } from "../utils/getCoastArcPath";

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
  // Extract avatar URLs from joinedUsers (already filtered and sliced by backend)
  const shownAvatars = joinedUsers?.map((u) => u.avatar) || [];

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
            <svg className="coast-arc">
              <path d={getCoastArcPath(coastDirection, "small")} />
            </svg>
          </div>
          <div className="metric-text">{windKts} knts</div>
          <div className="weather-type">{getWeatherIcon(weather)}</div>
          <div className="metric-text">{tempC}°C</div>
        </div>

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
