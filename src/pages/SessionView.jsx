import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Sessionblocklarge from "../components/SessionBlocklarge";
import "../App.css";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";



import "../styles/SessionView.css";
import {
  fetchSessionById,
  fetchSessionComments,
} from "../services/sessionService";
import Chat from "../components/Chat";
// import { getList } from "../../backend/getParseFunctions";

const defaultAvatars = [ava1, ava2, ava3];

export default function SessionViewPage({
  onJoinSession,
  joinedSessions = [],
  currentUser,
}) {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  

  // Load this one session by id
  useEffect(() => {
    if (!id) return;

    async function loadSession() {
      try {
        console.log("SessionView – URL id:", id);
        const data = await fetchSessionById(id);
        setSession(data);
      } catch (error) {
        console.error("Error fetching session by id:", error);
      }
    }

    loadSession();
  }, [id]);

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

  const onJoin = () => {
    onJoinSession(session.id);
  };


  // to avoid that session is null before data loads
  if (!session) {
    return <div className="page">Loading session…</div>;
  }

  return (
    <div className="page">
      {/* Title */}
      <div className="page-header">
        <div className="page-title">{session.spotName}</div>
        <div className="subtle">
          {session.sessionDateTime
            ? session.sessionDateTime.toLocaleDateString()
            : "-"}{" "}
          |{" "}
          {session.sessionDateTime
            ? session.sessionDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </div>
      </div>

      {/* Session card */}
      <Sessionblocklarge
        spot={session.spotName}
        windKts={session.windPower}
        tempC={session.temperature}
        weather={session.weatherType}
        windDir={session.windDirection}
        avatars={defaultAvatars}
        onJoin={onJoin}
        isJoined={joinedSessions.includes(session.id)}
      />

      {/* Subtitle */}
      <div className="section-subtitle">
        Communicate with others joining this session:
      </div>

      <Chat 
        comments={comments} 
        currentUser={currentUser} 
        setComments={setComments} 
        session={session}
        spot={null} />
    </div>
  );
}
