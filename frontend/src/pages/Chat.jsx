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
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to chat
    const newUserMessage = {
      text: userMessage,
      isUser: true,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await sendMessage(userMessage);
      
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
            <div className="header-title-section">
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

      <div className="chat-input-container">
        <form className="chat-input-form" onSubmit={handleSend}>
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
    </div>
  );
};

export default Chat;

