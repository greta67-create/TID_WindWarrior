import "../App.css";
import { useState, useEffect } from "react";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import Parse from "../parse-init";
import { toggleJoinInSessionList } from "../utils/toggleJoinInList";

function SessionFeedPage() {
  const [surfSessions, setSurfSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load future sessions from cloud function
  useEffect(() => {
    async function loadSessions() {
      setLoading(true);
      try {
        const results = await Parse.Cloud.run("loadSessions", {
          filters: { futureOnly: true },
        });
        console.log("Loaded sessions in Feed:", results);
        // Sort by sessionDateTime: earliest first
        const sorted = [...results].sort(
          (a, b) => new Date(a.sessionDateTime) - new Date(b.sessionDateTime)
        );
        setSurfSessions(sorted);
      } catch (err) {
        console.error("Error loading sessions in Feed:", err);
        setSurfSessions([]);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  // Join/unjoin session (uses enhanced toggle with avatar support)
  const onJoin = (id) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleJoinInSessionList(id, surfSessions, setSurfSessions);
  };

  if (loading) {
    return <div className="page">Loading sessions...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Your Session Feed</div>
      </div>
      <div className="section-subtitle">
        Top sessions based on the weather forecast
      </div>
      <div className="stack">
        {surfSessions.map((s) => (
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
              onJoin={onJoin(s.id)}
              isJoined={s.isJoined}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SessionFeedPage;
