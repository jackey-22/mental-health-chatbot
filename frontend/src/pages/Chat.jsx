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
        <button className="back-button" onClick={() => navigate('/')} aria-label="Go back to home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1>Mental Health Support Chatbot</h1>
        <p className="disclaimer">
          ⚠️ This chatbot provides emotional support and is not a substitute for
          professional medical advice. If you're in crisis, please contact a
          mental health professional or emergency services.
        </p>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        
        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          className="chat-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="send-button"
          disabled={isLoading || !inputValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

