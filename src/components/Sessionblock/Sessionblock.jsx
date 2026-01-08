import "../../styles/Sessionblock.css";
import JoinButton from "./JoinButton";
import getWeatherIcon from "../../utils/getWeatherIcon";
import { getCoastArcPath } from "../../utils/getCoastArcPath";
import AvatarStack from "./AvatarStack";

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

        <AvatarStack joinedUsers={joinedUsers} joinedCount={joinedCount} />
      </div>
    </div>
  );
}
