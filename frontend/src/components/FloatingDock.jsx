import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FloatingDock.css';

const FloatingDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const ChatIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dock-svg-icon">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dock-svg-icon">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const menuItems = [
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: <ChatIcon />, 
      path: '/chat',
      color: '#8a7cb4'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className="floating-dock-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`floating-dock ${isHovered ? 'expanded' : ''}`}>
        {/* Glow effect background */}
        <div className="dock-glow"></div>

        {/* Menu items */}
        <div className="dock-items">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              className={`dock-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
              style={{
                '--item-color': item.color,
                '--item-index': index
              }}
            >
              <span className="dock-icon">{item.icon}</span>
              {isHovered && <span className="dock-label">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Separator line */}
        <div className="dock-separator"></div>

        {/* Home/Back button */}
        <button
          className={`dock-item home-btn ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
          title="Home"
          style={{ '--item-color': '#8a7cb4' }}
        >
          <span className="dock-icon"><HomeIcon /></span>
          {isHovered && <span className="dock-label">Home</span>}
        </button>
      </div>
    </div>
  );
};

export default FloatingDock;
