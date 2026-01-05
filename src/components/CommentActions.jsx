import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';
import '../styles/Chat.css';

function CommentActions({ commentId, handleDeleteComment, handleEditComment }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const wrapperRef = useRef(null);

  // toggle tooltip visibility
  const toggleTooltip = () => {
    setIsTooltipVisible(prev=> !prev);
  };

  // handle click outside of tooltip to close it
  useEffect(() => {
    if (!isTooltipVisible) return;

    const handleClickOutside = (event) => {
      console.log("handleClickOutside", event.target);
      console.log("wrapperRef.current", wrapperRef.current);
      if (!wrapperRef.current?.contains(event.target)) {
        setIsTooltipVisible(false);
      }
    };

    //add event listener to document to handle click outside
    document.addEventListener('mousedown', handleClickOutside);

    // remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipVisible]); 

  return (
    <div className="chat-actions" ref={wrapperRef}>
      <button className="chat-toggle-btn" onClick={toggleTooltip}>
        <BsThreeDotsVertical />
      </button>

      {isTooltipVisible && (
        <div className="chat-tooltip">
          <button className="chat-tooltip-btn" onClick={()=> handleEditComment()}>
            <MdEdit />
          </button>
          <button className="chat-tooltip-btn delete" onClick={()=> handleDeleteComment(commentId)}>
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentActions;