import "../App.css";
import { useState, useEffect } from "react";
import Sessionblock from "../components/Sessionblock/Sessionblock";
import { Link } from "react-router-dom";
import Parse from "../parse-init";
import { toggleJoinInSessionList } from "../utils/toggleJoinInList";
import Page from "../components/Page";

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
        setSurfSessions(results);
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
    await toggleJoinInSessionList(id, surfSessions, setSurfSessions);
  };

  if (loading) {
    return <div className="page">Loading sessions...</div>;
  }

  return (
    <Page
      title="Your Session Feed"
      subtitle="Top sessions based on the weather forecast"
    >
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
    </Page>
  );
}

export default SessionFeedPage;
