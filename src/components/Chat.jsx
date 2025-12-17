import { useState } from "react";
import ChatActions from "./CommentChatActions";
import { createComment, deleteComment } from "../services/commentService";

export default function Chat({
  comments,
  currentUser,
  setComments,
  session,
  spot,
  // hide proposed comments as default off, but turned on in Spotview
  hideProposedComments = false,
  proposedComments: initialProposedComments = [],
}) {
  const [input, setInput] = useState("");
  const [proposedComments, setProposedComments] = useState(
    initialProposedComments
  );

  // handle delete comment
  const handleDeleteComment = (commentId) => {
    deleteComment(commentId, session?.id, spot?.id || null)
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  // handle edit comment, will be implemented in the future
  const handleEditComment = () => {
    alert("Edit comment feature coming soon!");
  };

  // handle send comment
  const handleSendClick = () => {
    if (input.trim() === "") return; // prevent adding empty comments

    if (session) { console.log("Creating comment for session:", session.id); } 
    else if (spot) { console.log("Creating comment for spot:", spot.id); }
    // create comment for session or spot
    createComment(session?.id, spot?.id, currentUser, input)
    // add comment to comments array
    setComments((prev) => [...prev, savedComment]);
    setInput(""); // Clear the input field only on success
  };

  // handle proposed comment click
  const handleProposedCommentClick = (text, id) => {
    setInput(text);
    setProposedComments((prev) => prev.filter((pc) => pc.id !== id));
  };

  return (
    <div className="chat">
      <div className="chat-list">
        {comments.map((comment) => (
          <div key={comment.id} className="chat-item">
            <div className="chat-title">
              <div>
                <strong>{comment.name}</strong>
                <time>{comment.time || "Date Unknown"}</time>
              </div>
              {/* only show edit and delete buttons if the comment is owned by the current user */}
              {comment.user_id === currentUser.id ? (
                <ChatActions
                  commentId={comment.id}
                  handleDeleteComment={handleDeleteComment}
                  handleEditComment={handleEditComment}
                />
              ) : null}
            </div>
            <div className="chat-text">{comment.text}</div>
          </div>
        ))}
      </div>

      {/* comment bar at bottom of page*/}
      <div className="comment-bar">
        {!hideProposedComments && (
          <div className="prop-comment">
            {proposedComments.map((proposed) => (
              <button
                key={proposed.id}
                type="button"
                className="chip"
                onClick={() => handleProposedCommentClick(proposed.text, proposed.id)}
              >
                {proposed.text}
              </button>
            ))}
          </div>
        )}

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
