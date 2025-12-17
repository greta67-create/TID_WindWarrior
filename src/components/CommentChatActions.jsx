import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';
import '../styles/Chat.css';

function ChatActions({ commentId, handleDeleteComment, handleEditComment }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const wrapperRef = useRef(null);
  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsTooltipVisible(false);
      }
    }
    if (isTooltipVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

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
          <button className="chat-tooltip-btn" onClick={() => handleEditComment()}>
            <MdEdit />
          </button>
          <button className="chat-tooltip-btn delete" onClick={() => handleDeleteComment(commentId)}>
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatActions;