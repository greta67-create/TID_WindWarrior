import "/src/App.css";
import Sessionblock from "../components/Sessionblocksmall";
import { Link, useParams, useNavigate } from "react-router-dom";

// Temporary data until there’s a backend
const MOCK_SESSIONS = [
  {
    id: "a1",
    spot: "Amager Strand",
    dateLabel: "Apr 4th",
    timeLabel: "12pm",
    windKts: 21,
    tempC: 18,
    weather: "🌤️",
    windDir: "↗",
  },
  {
    id: "a2",
    spot: "Amager Strand",
    dateLabel: "Apr 4th",
    timeLabel: "4pm",
    windKts: 18,
    tempC: 16,
    weather: "⛅",
    windDir: "↗",
  },
  {
    id: "a3",
    spot: "Amager Strand",
    dateLabel: "Apr 6th",
    timeLabel: "10am",
    windKts: 11,
    tempC: 20,
    weather: "☁️",
    windDir: "↗",
  },
];

const MOCK_COMMENTS = [
  {
    id: "c1",
    name: "Carl",
    sports: "Kite, Wing",
    date: "4. April 16:21",
    text: "Super nice spot, good parking options and plenty of space.",
  },
  {
    id: "c2",
    name: "Kai",
    sports: "Kite",
    date: "12. April 16:44",
    text: "Can be quite crowded, Surf School on Wednesdays takes a lot of space…",
  },
];

export default function SpotViewPage() {
  const { spotName } = useParams();
  const name = decodeURIComponent(spotName || "");
  const navigate = useNavigate();

  // higer wind first rule (can be adapted though)
  const sessions = MOCK_SESSIONS.filter((s) => s.spot === name).sort(
    (a, b) => b.windKts - a.windKts
  );

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">{name}</div>
          <div className="section-subtitle">Top sessions for the next days</div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="stack" style={{ marginTop: 12 }}>
        {sessions.map((s) => (
          <Sessionblock
            key={s.id}
            spot={s.spot}
            dateLabel={s.dateLabel}
            timeLabel={s.timeLabel}
            windKts={s.windKts}
            tempC={s.tempC}
            weather={s.weather}
            windDir={s.windDir}
            onJoin={() => navigate(`/session/${s.id}`)}
          />
        ))}
      </div>
      {/* Comments section */}
      <div className="section-subtitle" style={{ marginTop: 16 }}>
        What others say about this place:
      </div>

      <div className="chat-list">
        {MOCK_COMMENTS.map((c) => (
          <div key={c.id} className="chat-item">
            <strong>{c.name}</strong>
            <span style={{ opacity: 0.6, marginLeft: 8, fontSize: 12 }}>
              {c.date}
            </span>
            <div style={{ marginTop: 4 }}>{c.text}</div>
          </div>
        ))}
      </div>

      <div className="comment-bar">
        <div className="comment-inner">
          <input className="comment-input" placeholder="Add Comment" />
          <button className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
}
