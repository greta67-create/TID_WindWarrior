import "/src/App.css";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";

function SessionFeedPage({ sessions = [] }) {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Session Feed</div>
      </div>
      <div className="stack">
        {sessions.map((s) => (
          <Link
            key={s.id}
            to={`/session/${s.id}`}
            style={{ textDecoration: "none" }}
          >
            <Sessionblock
              spot={s.spot}
              dateLabel={s.dateLabel}
              timeLabel={s.timeLabel}
              windKts={s.windKts}
              tempC={s.tempC}
              weather={s.weather}
              windDir={s.windDir}
              onJoin={() => alert(`Join session ${s.id}`)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SessionFeedPage;
