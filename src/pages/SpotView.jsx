import "../App.css";
import Sessionblock from "../components/Sessionblock";
import Parse from "../parse-init";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Chat from "../components/Chat";
import {
  fetchSpotByName,
  fetchCommentsToSpotId,
  fetchUpcomingSessionsToSpotId,
} from "../services/spotService";
import {
  joinSession,
  unjoinSession,
  fetchUserSessions,
} from "../services/usersessionService";

export default function SpotViewPage() {
  const { spotName } = useParams();
  const name = decodeURIComponent(spotName || "");
  const [spot, setSpot] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(Parse.User.current());
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  //load spot information
  useEffect(() => {
    const loadSpot = async () => {
      try {
        fetchSpotByName(spotName).then((spot) => {
          fetchCommentsToSpotId(spot.id).then((loadedComments) => {
            console.log("Loaded comments:", loadedComments);
            setComments(loadedComments);
          });

          fetchUpcomingSessionsToSpotId(spot.id).then((loadedSessions) => {
            console.log("Loaded sessions:", loadedSessions);
            setSessions(loadedSessions);
          });

          setSpot(spot);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error:", error);
        setComments([]);
      }
    };
    loadSpot();
  }, []);

  //load current, joined user sessions
  useEffect(() => {
    const user = Parse.User.current();
    if (!user) return;
    //load Usersessions for specific user from backend
    async function loadUserSessions() {
      try {
        const sessions = await fetchUserSessions(user);
        console.log("Loaded user sessions in SpotView:", sessions);
        const ids = sessions.map((s) => s.id); // 👈 keep only ids
        setJoinedSessions(ids);
      } catch (err) {
        console.error("Error loading user sessions in SpotView:", err);
      }
    }

    loadUserSessions();
  }, []);

  // keep only upcoming sessions for the feed
  useEffect(() => {
    const now = new Date();

    const upcoming = sessions
      .filter((s) => s.sessionDateTime && s.sessionDateTime >= now)
      .sort((a, b) => a.sessionDateTime - b.sessionDateTime); // earliest → latest

    setUpcomingSessions(upcoming);
    console.log("Upcoming sessions in spot view:", upcoming);
  }, [sessions]);

  //hande join/unjoin and add usersession to DB
  const handleJoin = (id) => async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Join button clicked", id);

    const currentlyJoined = joinedSessions.includes(id);

    // optimistic UI: toggle locally
    setJoinedSessions((prev) =>
      currentlyJoined ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

    try {
      if (currentlyJoined) {
        await unjoinSession(id);
      } else {
        await joinSession(id);
        console.log("(Un-)oined session from ProfileView:", id);
      }
    } catch (error) {
      console.error("Error toggling user session in feed:", error);
      setJoinedSessions((prev) =>
        currentlyJoined ? [...prev, id] : prev.filter((sid) => sid !== id)
      );
    }
  };

  //Is the part below with error handling necessary or overengineered?
  // Error handling
  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title">{name || "Loading spot..."}</div>
        </div>
        <div className="section-subtitle">Loading data…</div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">{spot?.name || name}</div>
          {spot?.mainText && (
            <div className="spot-description">{spot.mainText}</div>
          )}
          <div className="section-subtitle" style={{ marginTop: 12 }}>
            Top sessions for the next days
          </div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="stack" style={{ marginTop: 12 }}>
        {upcomingSessions.map((s) => (
          <Link key={s.id} to={`/session/${s.id}`} className="session-link">
            <Sessionblock
              key={s.id}
              spot={s.spotName}
              dateLabel={s.dateLabel}
              timeLabel={s.timeLabel}
              windKts={s.windPower}
              tempC={s.temperature}
              weather={s.weatherType}
              windDir={s.windDirection}
              onJoin={handleJoin(s.id)}
              isJoined={joinedSessions.includes(s.id)}
            />
          </Link>
        ))}
      </div>
      {/* Comments section */}
      <div className="section-subtitle">What others say about this place:</div>
      <Chat
        comments={comments}
        currentUser={Parse.User.current()}
        setComments={setComments}
        session={null}
        spot={spot}
      />
    </div>
  );
}
