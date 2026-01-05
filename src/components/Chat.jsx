import { useState } from "react";
import CommentActions from "./CommentActions";
import { createComment, deleteComment } from "../services/commentService";

export default function Chat({
  comments,
  currentUser,
  setComments,
  session,
  spot,
  // show proposed comments by default, but hide them in Spotview
  showProposedComments = true,
  initialProposedComments = [],
}) {
  const [input, setInput] = useState("");
  const [proposedComments, setProposedComments] = useState(
    initialProposedComments);

  // handle delete comment (waits for backend to delete comment)
  const handleDeleteComment = async (commentId) => {
    try {
      const success = await deleteComment(commentId);
      if (success) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } else {
        // User is not authorized to delete this comment
        alert("You are not authorized to delete this comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      
      // if error message from Parse server, display it to the user 
      if (error.message) {  
        alert(error.message);
      } else {
        alert("Failed to delete comment. Please try again.");
      }
    }
  };

  // handle edit comment, will be implemented in the future
  const handleEditComment = () => {
    alert("Edit comment feature coming soon!");
  };

  // handle send comment (waits for backend to save comment)
  const handleSendClick = async () => {
    const message = input.trim();

    // input checks
    if (message === "") return; // prevent adding empty comments
    if (message.length < 3) {
      alert("Comment must be at least 3 characters");
      return;
    }
    if (message.length > 1000) {
      alert("Comment must be less than 1000 characters");
      return;
    }

    if (session) { console.log("Creating comment for session:", session.id); } 
    else if (spot) { console.log("Creating comment for spot:", spot.id); }

    try {
      // create comment for session or spot and save to backend
      const savedComment = await createComment(session?.id, spot?.id, currentUser, message);
      // add comment to comments array
      setComments((prev) => [...prev, savedComment]);
      setInput(""); // Clear the input field only on success
    } catch (error) {
      console.error("Error creating comment:", error);
      
      // if error message from Parse server from input validation, display it to the user 
      if (error.message) {  
        alert(error.message);
      } else {
        alert("Failed to save comment. Please try again.");
      }
    }
  };

  // handle proposed comment click
  const handleProposedCommentClick = (proposedMessage, id) => {
    setInput(proposedMessage);
    // remove proposed comment from proposedComments array
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
                <CommentActions
                  commentId={comment.id}
                  handleDeleteComment={handleDeleteComment}
                  handleEditComment={handleEditComment}
                />
              ) : null}
            </div>
            <div className="chat-message">{comment.message}</div>
          </div>
        ))}
      </div>

      {/* comment bar at bottom of page with proposed comments if showProposedComments is true*/}
      <div className="comment-bar">
        {showProposedComments && (
          <div className="prop-comment">
            {proposedComments.map((proposed) => (
              <button
                key={proposed.id}
                type="button"
                className="chip"
                onClick={() => handleProposedCommentClick(proposed.message, proposed.id)}
              >
                {proposed.message}
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
          />
          <button className="send-btn" onClick={handleSendClick}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
