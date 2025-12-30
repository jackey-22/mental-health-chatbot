import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  Psychology as PsychologyIcon,
  InfoOutlined as InfoIcon,
  Add as AddIcon,
  Assignment as AssessmentIcon,
  TrendingUp as AnalyticsIcon,
  Send as SendIcon
} from '@mui/icons-material';
import MessageBubble from '../components/MessageBubble';
import { sendMessage } from '../services/api';
import './Chat.css';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm here to listen and provide support. How are you feeling today?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Quick reply options
  const quickReplies = [
    "I'm feeling anxious",
    "I'm feeling sad",
    "I'm stressed about something",
    "I need someone to talk to",
    "I'm having trouble sleeping",
    "I'm feeling overwhelmed",
  ];

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewConversation = () => {
    setShowNewChatConfirm(true);
  };

  const confirmNewConversation = () => {
    setMessages([
      {
        text: "Hello! I'm here to listen and provide support. How are you feeling today?",
        isUser: false,
      },
    ]);
    setShowQuickReplies(true);
    setShowNewChatConfirm(false);
  };

  const cancelNewConversation = () => {
    setShowNewChatConfirm(false);
  };

  const handleSend = async (e, quickReplyText = null) => {
    if (e) e.preventDefault();

    const messageToSend = quickReplyText || inputValue.trim();

    if (!messageToSend || isLoading) {
      return;
    }

    setInputValue('');
    setShowQuickReplies(false); // Hide quick replies after first message
    
    // Add user message to chat
    const newUserMessage = {
      text: messageToSend,
      isUser: true,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get last 10 messages for context (increased from 5)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      // Send message to backend with conversation history
      const response = await sendMessage(messageToSend, conversationHistory);
      
      // Add bot response to chat
      const botMessage = {
        text: response.reply,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Handle errors gracefully
      const errorMessage = {
        text: "I'm sorry, I'm having trouble responding right now. Please try again, or consider reaching out to a mental health professional for support.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    handleSend(null, reply);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')} aria-label="Go back to home">
            <ArrowBackIcon />
          </button>
          <div className="header-info">
            <div className="ai-avatar">
              <PsychologyIcon />
            </div>
            <div className="header-text">
              <h1>Mental Health Support</h1>
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span className="status-text">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="header-disclaimer">
          <InfoIcon sx={{ fontSize: 16 }} />
          <span>This chatbot provides emotional support, not medical advice.</span>
        </div>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg.text} isUser={msg.isUser} />
          ))}
          
          {isLoading && (
            <div className="loading-indicator">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Reply Buttons */}
      {showQuickReplies && messages.length === 1 && !isLoading && (
        <div className="quick-replies">
          <p className="quick-replies-label">Quick replies:</p>
          <div className="quick-replies-grid">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input-container">
        <form className="chat-input-form" onSubmit={handleSend}>
          <div className="input-actions">
            <button 
              type="button"
              className="action-btn new-chat-action"
              onClick={handleNewConversation}
              title="Start New Chat"
            >
              <AddIcon sx={{ fontSize: 18 }} />
              New Chat
            </button>
            <button 
              type="button"
              className="action-btn"
              onClick={() => navigate('/assessment')}
              title="Take PHQ-9 Assessment"
            >
              <AssessmentIcon sx={{ fontSize: 18, mr: 0.5 }} />
              Assessment
            </button>
            <button 
              type="button"
              className="action-btn"
              onClick={() => navigate('/analytics')}
              title="View Analytics"
            >
              <AnalyticsIcon sx={{ fontSize: 18, mr: 0.5 }} />
              Analytics
            </button>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </form>
      </div>

      {/* New Chat Confirmation Modal */}
      {showNewChatConfirm && (
        <div className="new-chat-modal">
          <div className="modal-content">
            <h3>Start a new conversation?</h3>
            <p>Your current conversation will remain in history. You can start fresh or continue here.</p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmNewConversation}>
                Start New
              </button>
              <button className="btn-cancel" onClick={cancelNewConversation}>
                Continue Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

