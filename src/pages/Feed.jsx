import "/src/App.css";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";

function SessionFeedPage() {
  const sessions = [
    {
      id: "1",
      spot: "Amager Strand",
      dateLabel: "Apr 4th",
      timeLabel: "12pm",
      windKts: 21,
      tempC: 18,
      weather: "⛅️",
      windDir: "↗",
    },
    {
      id: "2",
      spot: "Dragør",
      dateLabel: "Apr 4th",
      timeLabel: "2pm",
      windKts: 19,
      tempC: 17,
      weather: "⛅️",
      windDir: "↗",
    },
    {
      id: "3",
      spot: "Sydvestpynten",
      dateLabel: "Apr 4th",
      timeLabel: "4pm",
      windKts: 17,
      tempC: 16,
      weather: "⛅️",
      windDir: "↗",
    },
  ];

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
