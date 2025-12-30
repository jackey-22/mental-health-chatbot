import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChatBubbleOutline as ChatIcon,
  Home as HomeIcon,
  Assignment as AssessmentIcon
} from '@mui/icons-material';
import './FloatingDock.css';

const FloatingDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: <ChatIcon />, 
      path: '/chat',
      color: '#8a7cb4'
    },
    { 
      id: 'assessment', 
      label: 'Assessment', 
      icon: <AssessmentIcon />, 
      path: '/assessment',
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
