import React from 'react';
import { 
  Psychology as PsychologyIcon, 
  Person as UserIcon 
} from '@mui/icons-material';
import './MessageBubble.css';

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
      {!isUser && (
        <div className="message-avatar">
          <PsychologyIcon sx={{ fontSize: 20 }} />
        </div>
      )}
      <div className="message-content">
        {message}
      </div>
      {isUser && (
        <div className="message-avatar user-avatar">
          <UserIcon sx={{ fontSize: 20 }} />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

