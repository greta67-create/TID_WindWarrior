import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Parse from "../parse-init";
import Sessionblocklarge from "../components/SessionBlocklarge";
import "../styles/SessionView.css";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import { fetchSessionComments } from "../services/commentService";
import { toggleJoinSingle } from "../utils/toggleJoinSingle";
import Chat from "../components/Chat";
import getWindfinderlink from "../utils/getWindfinderlink";

const defaultAvatars = [ava1, ava2, ava3];

const initialProposedComments = [
  { id: 100, text: "I have a car and can offer a ride!" },
  { id: 101, text: "Can someone offer a ride?" },
];

export default function SessionViewPage() {
  const { id } = useParams(); // get session id from url
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
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
        const loadedSession = results?.[0] || null;
        setSession(loadedSession);
        setIsJoined(loadedSession?.isJoined ?? false);
      } catch (err) {
        console.error("Error fetching session by id:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadSession();
  }, [id]);

  //handle join/unjoin session 
  const onJoin = async () => {
    if (!session) return;
    await toggleJoinSingle(session.id, isJoined, setIsJoined);
  };

  // Load comments for this session
  useEffect(() => {
    if (!session?.id) return;

    const loadComments = async () => {
      try {
        const loadedComments = await fetchSessionComments(session.id);
        setComments(loadedComments);
      } catch (error) {
        console.error("Error fetching session comments:", error);
        setComments([]);
      }
    };
    
    loadComments();
  }, [session?.id]);

  //loading notification pattern
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
          avatars={defaultAvatars}
          onJoin={onJoin}
          isJoined={isJoined}
        />

        {/* Get more information section */}
        <div className="info-section">
          <div className="info-title">Get more information:</div>
          <div className="info-buttons">
            {/* Left button: to SpotView */}
            <Link
              to={`/spot/${session.spotName}`}
              className="info-btn info-btn-primary"
            >
              About the spot
            </Link>

            {/* Right button: external link ( weather link) */}
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
      {/* Subtitle */}
      <div className="section-subtitle">
        Communicate with others joining this session:
      </div>

      <Chat
        comments={comments}
        currentUser={currentUser}
        setComments={setComments}
        session={session}
        spot={null}
        proposedComments={initialProposedComments}
      />
    </div>
  );
}
