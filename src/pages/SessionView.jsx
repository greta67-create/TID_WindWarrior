import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Parse from "../parse-init";
import Sessionblocklarge from "../components/SessionBlocklarge";
import Chat from "../components/Chat";
import { fetchSessionComments } from "../services/commentService";
import { toggleJoinSingle } from "../utils/toggleJoinSingle";
import getWindfinderlink from "../utils/getWindfinderlink";
import "../styles/SessionView.css";

const initialProposedComments = [
  { id: 100, message: "I have a car and can offer a ride!" },
  { id: 101, message: "Can someone offer a ride?" },
];

export default function SessionViewPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = Parse.User.current();

  // Load session by ID from cloud function
  useEffect(() => {
    if (!id) return;

    async function loadSession() {
      setLoading(true);
      try {
        const results = await Parse.Cloud.run("loadSessions", {
          filters: { sessionIds: [id] },
        });
        setSession(results[0]);
      } catch (err) {
        console.error("Error fetching session by id:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [id]);

  // Join/unjoin session (uses enhanced toggle with avatar support)
  const onJoin = async () => {
    if (!session) return;
    await toggleJoinSingle(session, setSession);
  };

  // Load comments with polling
  useEffect(() => {
    if (!session?.id) return;

    // load comments for this session with polling 
    const loadComments = async () => {
      try {
        const loadedComments = await fetchSessionComments(session.id);
        setComments(loadedComments);
      } catch (error) {
        console.error("Error fetching session comments:", error);
        setComments([]);
      }
    };

    // load comments immediately
    loadComments();

    // Poll for new comments every 10 seconds
    const interval = setInterval(() => {
      loadComments();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [session?.id]);

  if (loading) {
    return <div className="page">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title">Session not found</div>
        </div>
        <p>The session you're looking for doesn't exist.</p>
        <Link to="/">Back to Feed</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div>
        {/* Title */}
        <div className="page-header">
          <div className="page-title">{session.spotName}</div>
          <div className="subtle">
            {session.dateLabel} | {session.timeLabel}
          </div>
        </div>

        {/* Session card */}
        <Sessionblocklarge
          spot={session.spotName}
          windKts={session.windPower}
          tempC={session.temperature}
          weather={session.weatherType}
          windDir={session.windDirection}
          coastDirection={session.coastDirection}
          joinedUsers={session.joinedUsers || []}
          joinedCount={session.joinedCount || 0}
          onJoin={onJoin}
          isJoined={session.isJoined}
        />

        {/* Get more information section */}
        <div className="info-section">
          <div className="info-title">Get more information:</div>
          <div className="info-buttons">
            <Link
              to={`/spot/${session.spotName}`}
              className="info-btn info-btn-primary"
            >
              About the spot
            </Link>
            <a
              href={getWindfinderlink(session.spotName)}
              target="_blank"
              className="info-btn info-btn-secondary"
            >
              <span>About the weather</span>
              <span className="external-icon">→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="section-subtitle">
        Communicate with others joining this session:
      </div>

      <Chat
        comments={comments}
        currentUser={currentUser}
        setComments={setComments}
        session={session}
        spot={null}
        initialProposedComments={initialProposedComments}
      />
    </div>
  );
}
