import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Sessionblocklarge from "../components/SessionBlocklarge";
import "../App.css";
import Parse from "../parse-init";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import "../styles/SessionView.css";
import {
  fetchSessionById,
  fetchSessionComments,
} from "../services/sessionService";
// import { getList } from "../../backend/getParseFunctions";

const defaultAvatars = [ava1, ava2, ava3];

export default function SessionViewPage({
  onJoinSession,
  joinedSessions = [],
}) {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    document.title = "Sessions";
  }, []);

  useEffect(() => {
    document.title = "Sessions";
  }, []);

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

  const onJoin = () => {
    onJoinSession(session.id);
  };

  const handleSendClick = () => {
    if (input.trim() === "") return; // Prevent adding empty comments

    const newComment = {
      id: Date.now(),
      name: "You", // Static name for now
      time: new Date().toLocaleString(), // Current time
      text: input, // User input
    };
    setComments([...comments, newComment]); // Add the new comment to the array
    setInput(""); // Clear the input field
  };

  const handlePropCommentClick = (text) => {
    const newComment = {
      id: Date.now(),
      name: "You", // Static name for now
      time: new Date().toLocaleString(), // Current time
      text, // User input
    };
    setComments([...comments, newComment]); // Add the new comment to the array
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

      {/* Comments */}
      <div className="chat-list">
        {comments.map((c) => (
          <div key={c.id} className="chat-item">
            <strong>{c.name}</strong>
            <time>{c.time}</time>
            <div className="chat-text">{c.text}</div>
          </div>
        ))}
      </div>

      {/* Bottom text input (fixed above nav) */}
      <div className="comment-bar">
        <div className="prop-comment">
          {proposedComment.map((pc) => (
            <button
              key={pc.id}
              type="button"
              className="chip"
              onClick={() => handlePropCommentClick(pc.text)}
            >
              {pc.text}
            </button>
          ))}
        </div>
        <div className="comment-inner">
          <input
            className="comment-input"
            placeholder="Add Comment"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendClick();
              }
            }}
          />
          <button className="send-btn" onClick={handleSendClick}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
