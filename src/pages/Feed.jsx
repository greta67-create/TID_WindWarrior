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
              spot={s.spot}
              dateLabel={s.dateLabel}
              timeLabel={s.timeLabel}
              windKts={s.windKts}
              tempC={s.tempC}
              weather={s.weather}
              windDir={s.windDir}
              avatars={defaultAvatars}
              onJoin={handleJoin(s.id)}
              isJoined={joinedSessions.includes(s.id)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SessionFeedPage;
