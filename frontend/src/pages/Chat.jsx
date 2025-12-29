import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="header-info">
            <div className="ai-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Chat
            </button>
            <button 
              type="button"
              className="action-btn"
              onClick={() => navigate('/assessment')}
              title="Take PHQ-9 Assessment"
            >
              📊 Assessment
            </button>
            <button 
              type="button"
              className="action-btn"
              onClick={() => navigate('/analytics')}
              title="View Analytics"
            >
              📈 Analytics
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
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

