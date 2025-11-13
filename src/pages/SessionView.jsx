import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Sessionblocklarge from "../components/SessionBlocklarge";
import "../App.css";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import "../styles/SessionView.css";

const defaultAvatars = [ava1, ava2, ava3];

export default function SessionViewPage({
  sessions = [],
  onJoinSession,
  joinedSessions = [],
}) {
  const { id } = useParams();

  useEffect(() => {
    document.title = "Sessions";
  }, []);

  const session = sessions.find((x) => x.id === id) ||
    sessions[0] || {
      id: "unknown",
      spot: "Unknown Spot",
      dateLabel: "-",
      timeLabel: "-",
      windKts: 0,
      tempC: 0,
      weather: "⛅️",
      windDir: "↗",
      avatars: [],
    };

  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Carl",
      time: "4 Apr 16:21",
      text: "I'll be biking there at 11:30. 2 Seats left but don't bring too much stuff.",
    },
    { id: 2, name: "Ida", time: "4 Apr 16:25", text: "I'll join!" },
    { id: 3, name: "Tim", time: "4 Apr 16:27", text: "Me too!" },
  ]);

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

  return (
    <div className="page">
      {/* Title */}
      <div className="page-header">
        <div className="page-title">{session.spot}</div>
        <div className="subtle">
          {session.dateLabel} | {session.timeLabel}
        </div>
      </div>

      {/* Session card */}
      <Sessionblocklarge
        spot={session.spot}
        dateLabel={session.dateLabel}
        timeLabel={session.timeLabel}
        windKts={session.windKts}
        tempC={session.tempC}
        weather={session.weather}
        windDir={session.windDir}
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
