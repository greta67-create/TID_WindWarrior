import { useState } from "react";
import ChatActions from "./CommentChatActions";
import { createComment, deleteComment } from "../services/commentService";


export default function Chat({ comments, currentUser, setComments, session, spot }) {
    const [input, setInput] = useState("");
    const [proposedComments, setProposedComments] = useState([
        { id: 100, text: "I have a car and can offer a ride!" },
        { id: 101, text: "Can someone offer a ride?" },
    ]);


    const handleDeleteComment = (commentId) => {
    deleteComment(commentId)
        .then(() => {
        setComments(comments.filter((c) => c.id !== commentId));
        })
        .catch((error) => {
        console.error("Error deleting comment:", error);
        });
    };
    const handleEditComment = () => {
    alert("Edit comment feature coming soon!");
    };

    const handleSendClick = () => {
        if (input.trim() === "")  // Prevent adding empty comments
        console.log("Creating comment:", input);
        // either session or spot is null so it will be created accordingly
        if (session) {
            console.log("Creating comment for session:", session.id);
        } else if (spot) {
            console.log("Creating comment for spot:", spot.id);
        }
        createComment(session?.id, spot?.id, currentUser, input).then((savedComment) => {
            setComments([...comments, savedComment]);
        }).catch((error) => {
            console.error("Error creating comment:", error);
        });
        setInput(""); // Clear the input field
    };

    const handlePropCommentClick = (text, id) => {
    setInput(text);
    // remove proposed comment from the list
    setProposedComments(proposedComments.filter((pc) => pc.id !== id));
    };

    return (
        <div className="chat">
            <div className="chat-list">
                {comments.map((c) => (
                <div key={c.id} className="chat-item">
                    <div className="chat-title">
                    <div>
                        <strong>{c.name }</strong>
                        <time>{c.time || "Date Unknown"}</time>
                    </div>
                    {c.user_id === currentUser.id 
                        ? <ChatActions commentId={c.id} handleDeleteComment={handleDeleteComment} handleEditComment={handleEditComment} /> 
                        : null}
                        
                    </div>
                    <div className="chat-text">{c.text}</div>

                </div>
                ))}
            </div>

            <div className="comment-bar">
                <div className="prop-comment">
                {proposedComments.map((pc) => (
                    <button
                    key={pc.id}
                    type="button"
                    className="chip"
                    onClick={() => handlePropCommentClick(pc.text, pc.id)}
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