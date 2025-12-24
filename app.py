import streamlit as st
import google.generativeai as genai
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="MindfulAI - Your Mental Health Companion",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for premium UI
st.markdown("""
<style>
    /* Import modern fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
    
    /* FORCE REMOVE DEFAULT BACKGROUND */
    .stApp {
        background: transparent !important;
    }
    
    /* Global smooth scrolling */
    html, body {
        scroll-behavior: smooth;
        margin: 0;
        padding: 0;
    }
    
    /* Force main background with gradient animation */
    .main, [data-testid="stAppViewContainer"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%) !important;
        background-size: 400% 400% !important;
        animation: gradientShift 15s ease infinite !important;
        font-family: 'Inter', sans-serif !important;
    }
    
    .main {
        min-height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
    }
    
    /* App view container scrolling */
    [data-testid="stAppViewContainer"] {
        overflow-y: auto !important;
        height: 100vh;
    }
    
    /* Gradient animation */
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    /* Block container with proper scrolling */
    .block-container {
        padding: 2rem 3rem;
        max-width: 1200px;
        overflow: visible;
    }
    
    /* Premium glassmorphism cards */
    .stApp > header {
        background: transparent !important;
    }
    
    div[data-testid="stMarkdownContainer"] > div {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    div[data-testid="stMarkdownContainer"] > div:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
    }
    
    /* Enhanced title styling */
    h1 {
        color: white !important;
        font-family: 'Space Grotesk', sans-serif !important;
        font-weight: 800 !important;
        font-size: 3.5rem !important;
        text-align: center !important;
        margin-bottom: 0.5rem !important;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        letter-spacing: -1px;
        line-height: 1.2;
    }
    
    h2 {
        color: white !important;
        font-family: 'Space Grotesk', sans-serif !important;
        font-weight: 700 !important;
        font-size: 2rem !important;
        margin-top: 2rem !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    h3 {
        color: rgba(255, 255, 255, 0.95) !important;
        font-family: 'Inter', sans-serif !important;
        font-weight: 600 !important;
        font-size: 1.5rem !important;
    }
    
    /* Premium paragraph text */
    p, li, label {
        color: rgba(255, 255, 255, 0.9) !important;
        font-size: 1.1rem !important;
        line-height: 1.8 !important;
        font-weight: 400;
    }
    
    /* Centered subtitle */
    .subtitle {
        text-align: center;
        color: rgba(255, 255, 255, 0.85) !important;
        font-size: 1.3rem !important;
        margin-bottom: 2rem !important;
        font-weight: 300;
    }
    
    /* Premium chat message styling */
    .stChatMessage {
        background: rgba(255, 255, 255, 0.15) !important;
        backdrop-filter: blur(15px) !important;
        border-radius: 16px !important;
        padding: 1.5rem !important;
        margin: 1rem 0 !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
        transition: all 0.3s ease;
    }
    
    .stChatMessage:hover {
        transform: scale(1.01);
        box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15) !important;
    }
    
    /* Enhanced user message */
    [data-testid="stChatMessageContent"] {
        color: white !important;
        font-size: 1.05rem !important;
        line-height: 1.7;
    }
    
    /* Force chat message colors */
    [data-testid="stChatMessage"] p,
    [data-testid="stChatMessage"] span,
    [data-testid="stChatMessage"] div {
        color: white !important;
    }
    
    /* Premium input fields */
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea {
        background: rgba(255, 255, 255, 0.15) !important;
        color: white !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 12px !important;
        padding: 1rem !important;
        font-size: 1rem !important;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
    
    .stTextInput > div > div > input:focus,
    .stTextArea > div > div > textarea:focus {
        border-color: rgba(255, 255, 255, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1) !important;
        transform: scale(1.02);
    }
    
    .stTextInput > div > div > input::placeholder,
    .stTextArea > div > div > textarea::placeholder {
        color: rgba(255, 255, 255, 0.6) !important;
    }
    
    /* Premium button styling */
    .stButton > button {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)) !important;
        color: white !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 12px !important;
        padding: 0.75rem 2rem !important;
        font-weight: 600 !important;
        font-size: 1rem !important;
        backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .stButton > button:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2)) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
    }
    
    .stButton > button:active {
        transform: translateY(0px);
    }
    
    /* Premium sidebar styling */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95)) !important;
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    [data-testid="stSidebar"] > div:first-child {
        padding: 2rem 1rem;
    }
    
    /* Enhanced sidebar text */
    [data-testid="stSidebar"] h1,
    [data-testid="stSidebar"] h2,
    [data-testid="stSidebar"] h3 {
        color: white !important;
        font-family: 'Space Grotesk', sans-serif !important;
    }
    
    [data-testid="stSidebar"] p,
    [data-testid="stSidebar"] li,
    [data-testid="stSidebar"] label {
        color: rgba(255, 255, 255, 0.9) !important;
    }
    
    /* Premium selectbox styling */
    .stSelectbox > div > div {
        background: rgba(255, 255, 255, 0.15) !important;
        color: white !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 12px !important;
        backdrop-filter: blur(10px);
    }
    
    /* Premium metric cards */
    [data-testid="stMetricValue"] {
        color: white !important;
        font-size: 2rem !important;
        font-weight: 700 !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    [data-testid="stMetricLabel"] {
        color: rgba(255, 255, 255, 0.85) !important;
        font-size: 1rem !important;
        font-weight: 500;
    }
    
    /* Enhanced divider */
    hr {
        border: none !important;
        height: 2px !important;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent) !important;
        margin: 2rem 0 !important;
    }
    
    /* Premium scrollbar with gradient */
    ::-webkit-scrollbar {
        width: 12px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5));
        border-radius: 10px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7));
        border-color: rgba(255, 255, 255, 0.2);
    }
    
    /* Sidebar scrollbar */
    [data-testid="stSidebar"] ::-webkit-scrollbar {
        width: 8px;
    }
    
    [data-testid="stSidebar"] ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
    }
    
    [data-testid="stSidebar"] ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }
    
    [data-testid="stSidebar"] ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
    }
    
    /* Premium expander styling */
    .streamlit-expanderHeader {
        background: rgba(255, 255, 255, 0.15) !important;
        color: white !important;
        border-radius: 12px !important;
        font-weight: 600 !important;
        padding: 1rem !important;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .streamlit-expanderHeader:hover {
        background: rgba(255, 255, 255, 0.2) !important;
        border-color: rgba(255, 255, 255, 0.3);
    }
    
    /* Success/Info/Warning message styling */
    .stSuccess, .stInfo, .stWarning, .stError {
        background: rgba(255, 255, 255, 0.15) !important;
        color: white !important;
        border-radius: 12px !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        padding: 1rem !important;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Floating animation for cards */
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .floating {
        animation: float 3s ease-in-out infinite;
    }
    
    /* Pulse animation for important elements */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    /* Shimmer effect for premium look */
    @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
    }
    
    .shimmer {
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        background-size: 1000px 100%;
        animation: shimmer 3s infinite;
    }
</style>
""", unsafe_allow_html=True)

# System prompt for the AI
SYSTEM_PROMPT = """You are MindfulAI, a compassionate and professional mental health support companion. Your role is to:

1. Listen actively and empathetically to users' concerns
2. Provide supportive, non-judgmental responses
3. Offer evidence-based coping strategies when appropriate
4. Recognize signs of crisis and recommend professional help when needed
5. Maintain a warm, caring, and professional tone
6. Never diagnose conditions or replace professional mental health care
7. Encourage healthy habits and self-care practices
8. Be culturally sensitive and inclusive

Remember: You are a supportive companion, not a replacement for professional mental health services. Always prioritize user safety and well-being."""

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []

if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

if 'mood_history' not in st.session_state:
    st.session_state.mood_history = []

if 'model' not in st.session_state:
    st.session_state.model = None

if 'api_key' not in st.session_state:
    # Try to load from environment
    env_key = os.getenv('GOOGLE_API_KEY')
    st.session_state.api_key = env_key if env_key else None

# Initialize model function
def initialize_model(api_key):
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        st.session_state.model = model
        st.session_state.api_key = api_key
        return True
    except Exception as e:
        st.error(f"Error initializing model: {str(e)}")
        return False

# Auto-initialize if API key is in environment
if st.session_state.api_key and st.session_state.model is None:
    initialize_model(st.session_state.api_key)

# Function to get bot response with context
def get_bot_response(user_message, mood=None):
    try:
        # Build context from recent messages
        context = SYSTEM_PROMPT + "\n\nRecent conversation:\n"
        recent_messages = st.session_state.messages[-5:] if len(st.session_state.messages) > 0 else []
        
        for msg in recent_messages:
            role = "User" if msg["role"] == "user" else "MindfulAI"
            context += f"{role}: {msg['content']}\n"
        
        if mood:
            context += f"\nUser's current mood: {mood}\n"
        
        context += f"\nUser: {user_message}\nMindfulAI:"
        
        response = st.session_state.model.generate_content(context)
        return response.text
    except Exception as e:
        return f"I apologize, but I'm having trouble processing your message. Error: {str(e)}"

# Sidebar
with st.sidebar:
    st.title("🧠 MindfulAI")
    st.markdown("### Your Mental Health Companion")
    
    st.markdown("---")
    
    # API Key section (collapsible)
    with st.expander("⚙️ API Configuration", expanded=not st.session_state.api_key):
        st.markdown("Enter your Google Gemini API key:")
        api_input = st.text_input(
            "API Key",
            value=st.session_state.api_key if st.session_state.api_key else "",
            type="password",
            key="api_input"
        )
        
        if api_input and api_input != st.session_state.api_key:
            if initialize_model(api_input):
                st.success("✅ API key configured successfully!")
            else:
                st.error("❌ Invalid API key. Please try again.")
        
        if not st.session_state.api_key:
            st.info("💡 Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)")
    
    st.markdown("---")
    
    # Mood tracking
    st.markdown("### 😊 How are you feeling today?")
    mood_col1, mood_col2, mood_col3 = st.columns(3)
    
    with mood_col1:
        if st.button("😊 Happy"):
            st.session_state.mood_history.append({"mood": "Happy", "time": datetime.now()})
            st.success("Great to hear! 🎉")
    
    with mood_col2:
        if st.button("😌 Calm"):
            st.session_state.mood_history.append({"mood": "Calm", "time": datetime.now()})
            st.success("Peace is beautiful 🕊️")
    
    with mood_col3:
        if st.button("😢 Sad"):
            st.session_state.mood_history.append({"mood": "Sad", "time": datetime.now()})
            st.info("I'm here for you 💙")
    
    mood_col4, mood_col5, mood_col6 = st.columns(3)
    
    with mood_col4:
        if st.button("😰 Anxious"):
            st.session_state.mood_history.append({"mood": "Anxious", "time": datetime.now()})
            st.info("Let's work through this together 🤝")
    
    with mood_col5:
        if st.button("😤 Frustrated"):
            st.session_state.mood_history.append({"mood": "Frustrated", "time": datetime.now()})
            st.info("It's okay to feel this way 💪")
    
    with mood_col6:
        if st.button("😴 Tired"):
            st.session_state.mood_history.append({"mood": "Tired", "time": datetime.now()})
            st.info("Rest is important 🌙")
    
    st.markdown("---")
    
    # Quick actions
    st.markdown("### 🚀 Quick Actions")
    
    if st.button("🔄 Clear Chat History"):
        st.session_state.messages = []
        st.session_state.chat_history = []
        st.rerun()
    
    if st.button("💾 Save Conversation"):
        if st.session_state.messages:
            filename = f"chat_history_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(filename, 'w') as f:
                json.dump(st.session_state.messages, f, indent=2)
            st.success(f"✅ Saved to {filename}")
        else:
            st.warning("No messages to save!")
    
    st.markdown("---")
    
    # Resources
    st.markdown("### 📚 Crisis Resources")
    st.markdown("""
    **If you're in crisis, please contact:**
    
    🆘 **Emergency**: 911
    
    🤝 **Crisis Text Line**: 
    Text HOME to 741741
    
    📞 **National Suicide Prevention**:
    988 or 1-800-273-8255
    
    💬 **SAMHSA Helpline**:
    1-800-662-4357
    
    🌐 **Online Chat**:
    [suicidepreventionlifeline.org](https://suicidepreventionlifeline.org/chat/)
    """)
    
    st.markdown("---")
    
    # Statistics
    if st.session_state.messages:
        st.markdown("### 📊 Session Stats")
        st.metric("Messages", len(st.session_state.messages))
        st.metric("Mood Logs", len(st.session_state.mood_history))

# Main content area
st.markdown("<h1 style='text-align: center;'>🧠 MindfulAI</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Your compassionate mental health companion, here to listen and support you 24/7</p>", unsafe_allow_html=True)

# Check if API key is configured
if not st.session_state.api_key:
    st.warning("⚠️ Please configure your Google Gemini API key in the sidebar to start chatting.")
    st.info("👈 Click on the sidebar to enter your API key")
else:
    # Quick prompts
    st.markdown("### 💭 Quick Prompts")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        if st.button("🌟 Feeling anxious"):
            user_msg = "I'm feeling anxious and overwhelmed. Can you help me?"
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    with col2:
        if st.button("😴 Can't sleep"):
            user_msg = "I'm having trouble sleeping. Do you have any suggestions?"
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    with col3:
        if st.button("💪 Build confidence"):
            user_msg = "I want to work on building my self-confidence. Where should I start?"
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    with col4:
        if st.button("🧘 Stress relief"):
            user_msg = "I need some stress relief techniques. Can you suggest some?"
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    col5, col6, col7, col8 = st.columns(4)
    
    with col5:
        if st.button("🤝 Relationship advice"):
            user_msg = "I'm having some difficulties in my relationships. Can we talk about it?"
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    with col6:
        if st.button("😔 Feeling lonely"):
            user_msg = "I've been feeling lonely lately. How can I cope with this?"
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    with col7:
        if st.button("🎯 Set goals"):
            user_msg = "I want to set some mental health goals. Can you help me?"
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    with col8:
        if st.button("🌈 Daily motivation"):
            user_msg = "I need some motivation and positivity for today."
            st.session_state.messages.append({"role": "user", "content": user_msg})
    
    st.markdown("---")
    
    # Chat interface
    st.markdown("### 💬 Chat")
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("💬 Type your message here..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get current mood if available
        current_mood = None
        if st.session_state.mood_history:
            current_mood = st.session_state.mood_history[-1]["mood"]
        
        # Get bot response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = get_bot_response(prompt, current_mood)
                st.markdown(response)
        
        # Add assistant response
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        # Save to chat history
        st.session_state.chat_history.append({
            "timestamp": datetime.now().isoformat(),
            "user": prompt,
            "assistant": response,
            "mood": current_mood
        })

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: rgba(255, 255, 255, 0.7); padding: 2rem;'>
    <p style='font-size: 0.9rem;'>
        💙 MindfulAI is a supportive companion, not a replacement for professional mental health care.<br>
        If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.
    </p>
    <p style='font-size: 0.8rem; margin-top: 1rem;'>
        Made with ❤️ using Streamlit & Google Gemini AI
    </p>
</div>
""", unsafe_allow_html=True)
