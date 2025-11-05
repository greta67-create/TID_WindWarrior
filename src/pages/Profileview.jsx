import "../App.css";
import ProfileCard from "../components/Profilecard";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";

const defaultAvatars = [ava1, ava2, ava3];

export default function ProfileView({
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
        <div className="page-title">Profile</div>
      </div>
      <div className="page-content">
        <ProfileCard />
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Planned Sessions</h2>
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
                  avatars={defaultAvatars}
                  onJoin={handleJoin(s.id)}
                  isJoined={joinedSessions.includes(s.id)}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Past Sessions</h2>
        <div className="stack">
          <Sessionblock isJoined={true} joinedText={"Joined"} />
        </div>
      </div>
    </div>
  );
}
