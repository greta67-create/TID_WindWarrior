import "../App.css";
import SessionBlock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";

const defaultAvatars = [ava1, ava2, ava3];

function SessionFeedPage({
  sessions = [],
  onJoinSession,
  joinedSessions = [],
}) {
  const handleJoin = (id) => (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onJoinSession) onJoinSession(id);
  };

  console.log("Rendering SessionFeedPage with sessions:", sessions);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Your Session Feed</div>
      </div>
      <div className="section-subtitle">
        Top sessions based on the weather forecast
      </div>
      <div className="stack">
        {sessions.map((s) => (
          <Link
            key={s.id}
            to={`/session/${s.id}`}
            style={{ textDecoration: "none" }}
          >
            <SessionBlock
              spot={s.spotName}
              dateLabel={
                s.sessionDateTime ? s.sessionDateTime.toLocaleDateString() : "-"
              }
              timeLabel={
                s.sessionDateTime
                  ? s.sessionDateTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"
              }
              windKts={s.windPower}
              tempC={s.temperature}
              weather={s.weatherType}
              windDir={s.windDirection}
              avatars={defaultAvatars}
              onJoin={handleJoin(s.objectId)}
              isJoined={joinedSessions.includes(s.objectId)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SessionFeedPage;
