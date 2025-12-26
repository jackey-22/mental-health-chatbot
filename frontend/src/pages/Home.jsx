import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        {/* Animated Background Elements */}
        <div className="hero-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
          <div className="orb orb-5"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{ '--delay': `${i * 0.2}s` }}></div>
          ))}
        </div>
        
        {/* Geometric Shapes */}
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        {/* Gradient Mesh Background */}
        <div className="gradient-mesh"></div>
        
        <div className="hero-container">
          {/* Left Side - Content */}
          <div className="hero-content">
            <div className="hero-badge-wrapper">
              <div className="hero-badge">
                <span className="badge-icon">✨</span>
                <span className="badge-text">Here for you, always</span>
                <div className="badge-glow"></div>
              </div>
            </div>
            
            <h1 className="hero-headline">
              <span className="headline-word headline-word-1">
                <span className="word-inner">A safe place</span>
              </span>
              <span className="headline-word headline-word-2">
                <span className="word-inner">to talk.</span>
              </span>
              <span className="headline-word headline-word-3">
                <span className="word-inner">Anytime</span>
              </span>
              <span className="headline-word headline-word-4">
                <span className="word-inner">you need.</span>
              </span>
            </h1>
            
            <p className="hero-subtext">
              When things feel heavy, sometimes you just need someone to listen. 
              This is a space where you can share what's on your mind, without judgment, 
              without pressure, without having to explain yourself.
            </p>
            
            <div className="hero-cta">
              <button 
                className="btn-primary btn-fancy" 
                onClick={() => navigate('/chat')}
              >
                <span className="btn-text">Start a Conversation</span>
                <span className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
                <span className="btn-shine"></span>
                <span className="btn-ripple"></span>
              </button>
              <button 
                className="btn-secondary btn-fancy-secondary"
                onClick={() => {
                  document.getElementById('how-it-works').scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <span>How this helps</span>
              </button>
            </div>
          </div>

          {/* Right Side - Chat Preview */}
          <div className="hero-chat-preview">
            <div className="chat-preview-container">
              <div className="chat-preview-header">
                <div className="chat-preview-title">
                  <div className="chat-status-indicator"></div>
                  <span>Mental Health Support</span>
                </div>
              </div>
              
              <div className="chat-preview-messages">
                <div className="preview-message bot-message">
                  <div className="message-content">
                    Hello! I'm here to listen and provide support. How are you feeling today?
                  </div>
                </div>
                
                <div className="preview-message user-message">
                  <div className="message-content">
                    I've been feeling really anxious lately. I don't know why.
                  </div>
                </div>
                
                <div className="preview-message bot-message">
                  <div className="message-content">
                    I understand that anxiety can be overwhelming. You're not alone in feeling this way. Would you like to talk more about what might be triggering these feelings?
                  </div>
                </div>
                
                <div className="preview-message user-message">
                  <div className="message-content">
                    I think it's work stress. Everything feels so heavy.
                  </div>
                </div>
                
                <div className="preview-message bot-message typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              
              <div className="chat-preview-input">
                <input type="text" placeholder="Type your message..." disabled />
                <button type="button" disabled>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <div className="scroll-dot"></div>
        </div>
      </section>

      {/* Emotional Safety Section */}
      <section className="emotional-safety">
        <div className="container">
          <div className="safety-cards">
            <div className="safety-card">
              <div className="safety-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>You're not judged</h3>
              <p>
                Whatever you're feeling is valid. There's no right or wrong way 
                to experience what you're going through. This space is here to 
                accept you exactly as you are.
              </p>
            </div>

            <div className="safety-card">
              <div className="safety-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>You're not alone</h3>
              <p>
                Many people struggle with similar feelings. You don't have to 
                figure everything out by yourself. Sometimes just knowing someone 
                is there can make a difference.
              </p>
            </div>

            <div className="safety-card">
              <div className="safety-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>You can stay anonymous</h3>
              <p>
                Your privacy matters. You don't need to share your name or any 
                personal details. This is your space to be open without worrying 
                about who might see or know.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="how-it-works-header">
            <div className="how-it-works-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>3-STEP SUPPORT JOURNEY</span>
            </div>
            <h2 className="section-title">
              Three steps to<br />
              <span className="title-accent">Emotional Support</span>
            </h2>
            <p className="section-subtitle">
              From sharing your thoughts to receiving compassionate support, 
              all in a safe, judgment-free space.
            </p>
          </div>
          
          <div className="steps-timeline">
            <div className="step-box step-1">
              <div className="step-number-box">
                <span className="step-number">01</span>
              </div>
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <h3 className="step-title">Share Your Thoughts</h3>
                </div>
                <p className="step-description">
                  Type whatever you're feeling. It can be a few words or a longer 
                  message. There's no format to follow—just whatever feels right 
                  for you right now.
                </p>
              </div>
            </div>

            <div className="step-box step-2">
              <div className="step-number-box">
                <span className="step-number">02</span>
              </div>
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3 className="step-title">Receive Support</h3>
                </div>
                <p className="step-description">
                  You'll receive thoughtful, caring responses designed to help you 
                  feel heard and understood. Take your time with each exchange.
                </p>
              </div>
            </div>

            <div className="step-box step-3">
              <div className="step-number-box">
                <span className="step-number">03</span>
              </div>
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <h3 className="step-title">Find Help When Needed</h3>
                </div>
                <p className="step-description">
                  If you're in crisis or need professional support, we'll help you 
                  find resources. Your wellbeing is the priority, always.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Disclaimer Section */}
      <section className="trust-disclaimer">
        <div className="container">
          <div className="disclaimer-content">
            <p className="disclaimer-text">
              This chatbot offers emotional support, not medical advice. 
              It's designed to be a listening ear and a source of comfort, 
              but it's not a replacement for professional mental health care.
            </p>
            <p className="emergency-note">
              If you're experiencing a mental health emergency or having thoughts 
              of self-harm, please reach out to a crisis helpline or emergency 
              services immediately. In the US, you can call or text 988 for the 
              Suicide & Crisis Lifeline, available 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="final-cta-content">
            <p className="final-cta-text">
              You don't have to carry everything alone.
            </p>
            <button 
              className="btn-primary btn-large" 
              onClick={() => navigate('/chat')}
            >
              Start a Conversation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

