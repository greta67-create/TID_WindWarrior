import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Sessionblocklarge from "../components/SessionBlocklarge";
import "../styles/Sessionview.css";
import "../App.css";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import "../styles/SessionView.css";
import {
  fetchSessionById,
  fetchSessionComments,
} from "../services/sessionService";
import {
  fetchUserSessions,
  joinSession,
  unjoinSession,
} from "../services/usersessionService";
import Chat from "../components/Chat";
// import { getList } from "../../backend/getParseFunctions";

const defaultAvatars = [ava1, ava2, ava3];

export default function SessionViewPage(currentUser) {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  // Load this one session by id
  useEffect(() => {
    if (!id) return;

    async function loadSession() {
      try {
        console.log("SessionView URL id:", id);
        const data = await fetchSessionById(id);
        setSession(data);
      } catch (error) {
        console.error("Error fetching session by id:", error);
      }
    }

    loadSession();
  }, [id]);

  // check if user has joined this session
  useEffect(() => {
    if (!session) return;

    const user = Parse.User.current();
    if (!user) return;

    async function loadJoinState() {
      try {
        const userSessions = await fetchUserSessions(user);
        const ids = userSessions.map((s) => s.id); // or s.sessionId depending on your service
        setIsJoined(ids.includes(session.id));
      } catch (err) {
        console.error("Error loading joined state in SessionView:", err);
      }
    }

    loadJoinState();
  }, [session]);

  // join/unjoin logic: call backend and update local state
  const onJoin = async () => {
    if (!session) return; //dont do anything if data haven't loaded yet
    const sessionId = session.id;
    console.log("Join button clicked", id);
    const currentlyJoined = isJoined;

    // optimistic toggle (show UI change immediately)
    setIsJoined(!currentlyJoined);

    try {
      if (currentlyJoined) {
        await unjoinSession(sessionId);
        console.log("Usersession deleted in DB", id);
      } else {
        await joinSession(sessionId);
        console.log("Usersession saved in DB", id);
      }
    } catch (error) {
      console.error("Error toggling join state:", error);
      setIsJoined(currentlyJoined);
    }
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

  const proposedComment = [
    { id: 100, text: "I have a car and can offer a ride!" },
    { id: 101, text: "Can someone offer a ride?" },
  ];

  const [input, setInput] = useState("");

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
        isJoined={isJoined}
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
        spot={null}
      />
    </div>
  );
}
