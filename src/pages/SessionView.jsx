import { useParams } from "react-router-dom";
import Sessionblock from "../components/Sessionblock";
import "../App.css";

export default function SessionViewPage({ sessions = [] }) {
  const { id } = useParams();

  const session = sessions.find((x) => x.id === id) ||
    sessions[0] || {
      id: "unknown",
      spot: "Unknown Spot",
      dateLabel: "-",
      timeLabel: "-",
      windKts: 0,
      tempC: 0,
      weather: "⛅️",
      windDir: "↗",
    };

  const comments = [
    {
      id: 1,
      name: "Carl",
      time: "4 Apr 16:21",
      text: "I'll be biking there at 11:30. 2 Seats left but don't bring too much stuff.",
    },
    { id: 2, name: "Ida", time: "4 Apr 16:25", text: "I'll join!" },
    { id: 3, name: "Tim", time: "4 Apr 16:27", text: "Me too!" },
    {
      id: 4,
      name: "Lia",
      time: "4 Apr 16:43",
      text: "I'll join a bit later by bike :)",
    },
  ];

  const onJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Join session ${session.id}`);
  };

  return (
    <div className="page">
      {/* Title */}
      <div className="page-header">
        <div className="page-title">Session View</div>
      </div>

      {/* Session card */}
      <Sessionblock
        spot={session.spot}
        dateLabel={session.dateLabel}
        timeLabel={session.timeLabel}
        windKts={session.windKts}
        tempC={session.tempC}
        weather={session.weather}
        windDir={session.windDir}
        onJoin={onJoin}
      />

      {/* Subtitle */}
      <div className="section-subtitle">
        Communicate with others joining this session:
      </div>

      {/* Comments */}
      <div className="chat-list">
        {comments.map((c) => (
          <div key={c.id} className="chat-item">
            <strong>{c.name}</strong>
            <span style={{ opacity: 0.6, marginLeft: 8, fontSize: 12 }}>
              {c.time}
            </span>
            <div style={{ marginTop: 4 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Bottom text input (fixed above nav) */}
      <div className="comment-bar">
        <div className="comment-inner">
          <input className="comment-input" placeholder="Add Comment" />
          <button className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
}
