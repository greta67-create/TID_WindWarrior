import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Sessionblocklarge from "../components/SessionBlocklarge";
import "../App.css";
import Parse from "../parse-init";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import "../styles/SessionView.css";
// import { getList } from "../../backend/getParseFunctions";

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

  const session = sessions.find((s) => s.id === id) || sessions[0];
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const Comment = Parse.Object.extend("comment");
        const query = new Parse.Query(Comment);

        // only comments for THIS session
        const sessionPointer = new Parse.Object("Session_");
        sessionPointer.id = session.objectId; // the Parse id of this session
        query.equalTo("sessionId", sessionPointer);

        // also fetch the user so we can show their name
        query.include("userId");
        query.ascending("createdAt");

        const results = await query.find();

        const mapped = results.map((obj) => {
          const user = obj.get("userId");
          return {
            id: obj.id,
            name:
              (user && (user.get("firstName") || user.get("username"))) ||
              "Unknown user",
            time: obj.createdAt.toLocaleString(),
            text: obj.get("message"),
          };
        });

        setComments(mapped);
      } catch (error) {
        console.error("Error fetching session comments:", error);
      }
    };

    loadComments();
  }, []);

  const proposedComment = [
    { id: 100, text: "I have a car and can offer a ride!" },
    { id: 101, text: "Can someone offer a ride?" },
  ];

  const [input, setInput] = useState("");

  const onJoin = () => {
    onJoinSession(session.objectId);
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

  console.log("URL id:", id);
  console.log("Sessions array:", sessions);
  console.log("found session:", session);

  return (
    <div className="page">
      {/* Title */}
      <div className="page-header">
        <div className="page-title">{session.spotId.spotName}</div>
        <div className="subtle">
          {session.sessionDateTime
            ? new Date(session.sessionDateTime.iso).toLocaleDateString()
            : "-"}{" "}
          |{" "}
          {session.sessionDateTime
            ? new Date(session.sessionDateTime.iso).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </div>
      </div>

      {/* Session card */}
      <Sessionblocklarge
        spot={session.objectId}
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
