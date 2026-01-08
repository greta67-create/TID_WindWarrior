import { Link } from "react-router-dom";
import Sessionblock from "./Sessionblock";

// Component to display list of sessions or a message if the list is empty
export default function SessionList({ sessions, showJoin, onUnjoin }) {
  if (sessions.length === 0) {
    return (
      <div className="empty-profileview">
        <p>
          {showJoin
            ? "No Planned Sessions"
            : "Join a Session to Build Your History"}
        </p>
        {showJoin && (
          <Link to="/">
            <button className="browse-button">
              Click to see Upcoming Sessions
            </button>
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="stack">
      {sessions.map((s) => (
        <Link key={s.id} to={`/session/${s.id}`} className="session-link">
          <Sessionblock
            spot={s.spotName}
            dateLabel={s.dateLabel}
            timeLabel={s.timeLabel}
            windKts={s.windPower}
            tempC={s.temperature}
            weather={s.weatherType}
            windDir={s.windDirection}
            coastDirection={s.coastDirection}
            joinedUsers={s.joinedUsers || []}
            joinedCount={s.joinedCount || 0}
            onJoin={showJoin ? onUnjoin(s.id) : undefined}
            isJoined={showJoin ? true : undefined}
            showJoin={showJoin}
          />
        </Link>
      ))}
    </div>
  );
}
