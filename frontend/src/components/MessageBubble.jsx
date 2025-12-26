import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
      <div className="message-content">
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;

