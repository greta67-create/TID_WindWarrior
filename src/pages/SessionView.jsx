import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Parse from "../parse-init";
import Sessionblocklarge from "../components/SessionBlocklarge";
import "../styles/Sessionview.css";
import "../App.css";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import "../styles/SessionView.css";
import { fetchSessionComments } from "../services/commentService";
import { toggleJoinSingle } from "../utils/toggleJoinSingle";
import Chat from "../components/Chat";
import getWindfinderlink from "../utils/getWindfinderlink";

const defaultAvatars = [ava1, ava2, ava3];

export default function SessionViewPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const proposedComments = [
    { id: 100, text: "I have a car and can offer a ride!" },
    { id: 101, text: "Can someone offer a ride?" },
  ];
  const [loading, setLoading] = useState(true); //loading notification pattern
  const currentUser = Parse.User.current();
  console.log("SessionView currentUser:", currentUser);

  // load this session by id via cloud function
  useEffect(() => {
    if (!id) return;

    async function loadSession() {
      setLoading(true);
      try {
        const results = await Parse.Cloud.run("loadSessions", {
          filters: { sessionIds: [id] },
        });
        // takes firstSession from results array
        const firstsession = results?.[0] || null;
        setSession(firstsession);
        setIsJoined(firstsession?.isJoined ?? false);
      } catch (err) {
        console.error("Error fetching session by id:", err);
      }finally {
      setLoading(false);
    }}
    loadSession();
  }, [id]);

  const onJoin = async () => {
    if (!session) return;
    await toggleJoinSingle(session.id, isJoined, setIsJoined);
  };

  // Load comments for this session
  useEffect(() => {
    if (!session) return;

    const loadComments = async () => {
      try {
        const data = await fetchSessionComments(session.id);
        console.log("Fetched session comments:", data);
        setComments(data);
      } catch (error) {
        console.error("Error fetching session comments:", error);
      }
    };

    loadComments();
  }, [session]);


  if (loading) {
    return <div className="page">Loading sessions...</div>;
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
        proposedComments={proposedComments}
      />
    </div>
  );
}
