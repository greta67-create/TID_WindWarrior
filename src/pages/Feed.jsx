import "../App.css";
//import SessionBlock from "../components/Sessionblock";
import { useState, useEffect } from "react";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import Parse from "../parse-init";
import { toggleJoinInSessionList } from "../utils/toggleJoinInList";
const defaultAvatars = [ava1, ava2, ava3];

// function SessionFeedPage() 
function SessionFeedPage() {
  const [surfSessions, setSurfSessions] = useState([]);
  const [loading, setLoading] = useState(true); //loading notification pattern

  //load future sessions from cloud function
  useEffect(() => {
    async function loadSessions() {
      setLoading(true);
      try {
        const results = await Parse.Cloud.run("loadSessions", {
          filters: { futureOnly: true },
        });
        console.log("Loaded sessions in Feed:", results);
        setSurfSessions(results);
      } catch (err) {
        console.error("Error loading sessions in Feed:", err);
        setSurfSessions([]); // fallback so UI renders
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  //handle join/unjoin session in feed
  const onJoin = (id) => async (e) => {
    if (e?.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    await toggleJoinInSessionList(id, () => surfSessions, setSurfSessions);
  };



  if (loading) {
    return <div className="page">Loading sessions...</div>;
  }
  // Render session feed
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
          <Link
            key={s.id}
            to={`/session/${s.id}`}
            style={{ textDecoration: "none" }}
          >
            <Sessionblock
              spot={s.spotName}
              dateLabel={s.dateLabel}
              timeLabel={s.timeLabel}
              windKts={s.windPower}
              tempC={s.temperature}
              weather={s.weatherType}
              windDir={s.windDirection}
              coastDirection={s.coastDirection}
              avatars={defaultAvatars}
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
