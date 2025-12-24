# 🧠 MindfulChat - Professional Mental Health Support Chatbot

<div align="center">

![MindfulChat Banner](https://img.shields.io/badge/MindfulChat-Mental%20Health%20AI-blueviolet?style=for-the-badge)

[![Python Version](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/streamlit-1.28+-red.svg)](https://streamlit.io)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A premium, compassionate AI-powered mental health support chatbot built with Streamlit and Google's Gemini 2.5 Flash**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Technology](#-technology-stack) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎨 **Premium UI/UX Design**

- **🌈 Animated Gradient Background** - Mesmerizing 4-color gradient that shifts smoothly every 15 seconds
- **💎 Glassmorphism Design** - Modern frosted-glass aesthetic with backdrop blur effects
- **✨ Smooth Animations** - Professional slide-in, fade, hover, and transition effects
- **🔤 Premium Typography** - Custom Inter and Space Grotesk fonts for a polished look
- **📱 Responsive Layout** - Perfect experience on desktop, tablet, and mobile devices
- **🎭 3D Effects** - Elevated shadows and depth for a premium feel

### 🤖 **Advanced AI Capabilities**

- **⚡ Google Gemini 2.5 Flash** - Powered by Google's latest and fastest AI model
- **🧠 Context-Aware Conversations** - Remembers the last 5 messages for coherent dialogue
- **💝 Empathetic Responses** - Specially trained prompts for mental health support
- **🗣️ Natural Language Processing** - Human-like, compassionate interactions
- **🛡️ Error Handling** - Graceful error messages and recovery

### 💬 **Chat Features**

- **⚡ Real-time Messaging** - Instant AI-powered responses
- **🚀 8 Quick Prompts** - Pre-built conversation starters for common concerns
- **💾 Chat History** - Save and load conversations as JSON
- **🎨 Beautiful Message Bubbles** - Gradient-styled with smooth animations
- **⏰ Timestamp Tracking** - Every message is timestamped
- **📜 Auto-scroll** - Smooth scrolling to new messages

### 😊 **Wellness & Tracking Tools**

- **😊 Mood Tracking** - Log your emotions with 6 emoji buttons
  - 😊 Happy • 😌 Calm • 😔 Sad • 😰 Anxious • 😤 Frustrated • 😴 Tired
- **📊 Session Statistics** - Track total messages and mood logs
- **🆘 Crisis Resources** - Quick access to 24/7 hotlines and emergency numbers
- **💡 Self-Care Tips** - Curated wellness advice and mindfulness techniques
- **📚 Resource Links** - Direct access to mental health resources

### 🔒 **Privacy & Security**

- **🔐 100% Private** - All conversations stored locally on your device
- **🚫 No Data Collection** - Your privacy is our priority
- **🔒 Secure API Communication** - Encrypted connections to Google AI
- **👤 No Login Required** - Anonymous usage, no personal data stored
- **🗑️ Clear Chat Anytime** - Delete your history with one click

---

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Step-by-Step Setup

#### 1. **Clone or Download the Repository**
```bash
git clone https://github.com/yourusername/mindfulchat.git
cd mindfulchat
```

#### 2. **Install Required Dependencies**
```bash
pip install -r requirements.txt
```

The required packages are:
- `streamlit>=1.28.0` - Web framework
- `google-generativeai>=0.3.0` - Google AI SDK
- `python-dotenv>=1.0.0` - Environment variables

#### 3. **Set Up Your API Key**

Create a `.env` file in the project root:
```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your API key:
```env
GOOGLE_API_KEY=your_actual_api_key_here
```

**To get your free API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API key"
4. Copy and paste it into your `.env` file

#### 4. **Run the Application**
```bash
streamlit run app.py
```

#### 5. **Open in Browser**

The app will automatically open at `http://localhost:8501`

If it doesn't open automatically, click the link in your terminal.

---

## 💡 Usage

### Getting Started

1. **🚀 Launch the App** - Run `streamlit run app.py`
2. **🔑 API Key** - Your key from `.env` will load automatically
3. **💬 Start Chatting** - Type a message or use a quick prompt
4. **😊 Track Your Mood** - Click emoji buttons in the sidebar
5. **💾 Save Your Chat** - Use the save button to keep your conversation

### Quick Conversation Starters

Click any of these to start a conversation instantly:

| Emoji | Prompt | Use Case |
|-------|--------|----------|
| 😰 | **I'm feeling anxious** | Get support for anxiety |
| 🧠 | **Teach me coping strategies** | Learn stress management |
| 💼 | **Work is overwhelming me** | Discuss work stress |
| 😴 | **Can't sleep well** | Get sleep tips |
| 😔 | **Feeling lonely today** | Talk about loneliness |
| 🌟 | **Need some motivation** | Get inspired |
| 🧘 | **Want relaxation tips** | Learn mindfulness |
| 🆘 | **Need urgent support** | Access crisis resources |

### Advanced Features

#### 📊 Mood Tracking
- Click mood emojis in the sidebar to log how you're feeling
- View your mood log statistics in real-time
- Track emotional patterns over time

#### 💾 Chat Management
- **Save Chat** - Saves conversation to `chat_history.json`
- **Clear Chat** - Deletes all messages and starts fresh
- **Session Stats** - Track total messages and mood logs

#### 🆘 Crisis Support
The sidebar contains 24/7 crisis hotlines:
- 🆘 **988** - Suicide & Crisis Lifeline
- 📞 **1-800-273-8255** (National Lifeline)
- 💬 Text **"HELLO"** to **741741** (Crisis Text Line)

---

## 🛠 Technology Stack

### Frontend
- **Streamlit** - Modern web framework for Python
- **Custom CSS** - Professional styling with glassmorphism
- **HTML5** - Enhanced markup for better structure
- **Responsive Design** - Mobile-first approach

### AI/ML
- **Google Gemini 2.5 Flash** - Latest and fastest AI model
- **google-generativeai** - Official Python SDK
- **Context Management** - Conversation history tracking
- **Prompt Engineering** - Optimized for mental health support

### Backend
- **Python 3.8+** - Core programming language
- **python-dotenv** - Environment variable management
- **JSON** - Data storage and serialization
- **datetime** - Timestamp tracking

### Design
- **Inter Font** - Modern sans-serif typography
- **Space Grotesk** - Display font for headings
- **Glassmorphism** - Frosted glass UI effects
- **CSS Animations** - Smooth keyframe animations
- **Gradient Animations** - Dynamic background effects

---

## 📁 Project Structure

```
mindfulchat/
├── 📄 app.py                   # Main Streamlit application
├── 📋 requirements.txt         # Python dependencies
├── 🔐 .env                     # API key (create this)
├── 📝 .env.example            # Example environment file
├── 🚫 .gitignore              # Git ignore rules
├── 📖 README.md               # This file
├── 🧪 test_api.py             # API testing script
├── 📋 list_models.py          # List available Gemini models
├── 💾 chat_history.json       # Saved conversations (auto-generated)
└── ⚙️ .streamlit/
    └── config.toml            # Streamlit configuration
```

---

## 🎨 Customization

### Change Color Scheme

Edit the gradient colors in `app.py` (around line 30):

```python
# Main animated background gradient
background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);

# User message bubbles
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

# Bot message bubbles
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Modify AI Behavior

Update the `SYSTEM_PROMPT` in `app.py` (around line 350):

```python
SYSTEM_PROMPT = """You are a compassionate and empathetic mental health support chatbot named MindfulChat. 
Your role is to:
- Provide emotional support and active listening
- Offer coping strategies and mindfulness techniques
- Encourage positive thinking and self-care
...
"""
```

### Add More Quick Prompts

Extend the `quick_prompts` list in `app.py` (around line 850):

```python
quick_prompts = [
    ("😰", "I'm feeling anxious"),
    ("🎯", "Your custom prompt here"),
    ("🌈", "Another custom prompt"),
    # Add more...
]
```

### Customize Mood Options

Edit the `mood_options` dictionary (around line 640):

```python
mood_options = {
    "😊": "Happy",
    "😎": "Confident",  # Add new mood
    "😔": "Sad",
    # Add more moods...
}
```

---

## 🔧 Configuration

### Streamlit Settings

Edit `.streamlit/config.toml`:

```toml
[theme]
primaryColor = "#667eea"        # Main accent color
backgroundColor = "#ffffff"      # Background color
secondaryBackgroundColor = "#f5f7fa"
textColor = "#262730"
font = "sans serif"

[server]
headless = true
enableXsrfProtection = false

[browser]
gatherUsageStats = false
```

### Environment Variables

Available in `.env` file:

```env
# Required
GOOGLE_API_KEY=your_api_key_here

# Optional (for future features)
# MAX_HISTORY_LENGTH=5
# ENABLE_ANALYTICS=false
# LOG_LEVEL=INFO
```

---

## 🐛 Troubleshooting

### 🔑 API Key Issues

**Problem**: "API key not configured" or "Please configure your API key in the sidebar first"

**Solution**: 
1. Verify `.env` file exists in the project root
2. Check that it contains `GOOGLE_API_KEY=your_key_here`
3. Ensure there are no spaces around the `=` sign
4. Restart the Streamlit app completely
5. Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

### 🤖 Model Not Found Error

**Problem**: "404 models/gemini-pro is not found" or similar

**Solution**: 
- The app uses `gemini-2.5-flash` which is the latest model
- Ensure your API key has access (free tier includes this)
- Run `python list_models.py` to see available models

### 📦 Import/Module Errors

**Problem**: "ModuleNotFoundError" or "No module named 'streamlit'"

**Solution**: 
```bash
# Reinstall all dependencies
pip install -r requirements.txt --upgrade

# Or install individually
pip install streamlit google-generativeai python-dotenv
```

### 🎨 UI Not Loading Properly

**Problem**: Styles not appearing or broken layout

**Solution**: 
1. Hard refresh your browser: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try a different browser (Chrome recommended)
4. Check browser console for errors (F12)

### 💬 Chat Not Working

**Problem**: Messages not sending or no response

**Solution**:
1. Check terminal for error messages
2. Verify internet connection
3. Confirm API key is loaded (check sidebar for green checkmark)
4. Try clearing chat and starting fresh

### 🚀 Port Already in Use

**Problem**: "Address already in use" error

**Solution**:
```bash
# Kill existing Streamlit processes
# Windows
taskkill /F /IM streamlit.exe

# Mac/Linux
pkill -f streamlit

# Or use a different port
streamlit run app.py --server.port 8502
```

---

## ⚠️ Important Disclaimer

**MindfulChat is an AI-powered support tool and NOT a replacement for professional mental health care.**

### 🚨 When to Seek Professional Help

Seek immediate professional help if you're experiencing:

- ⚠️ Thoughts of self-harm or suicide
- 🆘 Severe depression or anxiety attacks
- 💊 Substance abuse or addiction issues
- 🩹 Trauma, abuse, or PTSD symptoms
- 🚨 Any mental health emergency

### 📞 Emergency Resources

#### 🆘 **Immediate Danger**
Call **911** or go to your nearest emergency room

#### 📞 **24/7 Crisis Hotlines (United States)**
- **988** - Suicide & Crisis Lifeline (call or text)
- **1-800-273-8255** - National Suicide Prevention Lifeline
- **1-800-662-4357** - SAMHSA National Helpline
- **1-800-799-7233** - National Domestic Violence Hotline
- **1-866-488-7386** - Trevor Project (LGBTQ+ youth)

#### 💬 **Crisis Text Line**
Text **"HELLO"** to **741741** (US)
Text **"START"** to **678678** (Canada)

#### 🌍 **International Resources**
- [IASP Crisis Centres Directory](https://www.iasp.info/resources/Crisis_Centres/)
- [Befrienders Worldwide](https://www.befrienders.org/)
- [International Association for Suicide Prevention](https://www.iasp.info/)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **🐛 Report Bugs** - Open an issue with detailed steps to reproduce
2. **💡 Suggest Features** - Share your ideas for improvements
3. **📝 Improve Documentation** - Fix typos, add examples, clarify instructions
4. **🔧 Submit Pull Requests** - Add features or fix bugs
5. **🎨 Design Improvements** - Enhance UI/UX
6. **🌍 Translations** - Help make MindfulChat multilingual

### Development Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/yourusername/mindfulchat.git
cd mindfulchat

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes
# - Edit files
# - Test thoroughly
# - Follow code style guidelines

# 5. Commit your changes
git add .
git commit -m "Add amazing feature: description"

# 6. Push to your fork
git push origin feature/amazing-feature

# 7. Open a Pull Request on GitHub
```

### Code Style Guidelines

- Follow **PEP 8** for Python code
- Use **meaningful variable names**
- Add **comments** for complex logic
- Write **docstrings** for functions
- Test all features before submitting
- Update documentation if needed

### Testing Checklist

Before submitting a PR, ensure:
- [ ] App runs without errors
- [ ] All features work as expected
- [ ] UI looks good on desktop and mobile
- [ ] No console errors
- [ ] API calls work correctly
- [ ] Chat history saves/loads properly
- [ ] Mood tracking functions
- [ ] Documentation is updated

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 MindfulChat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

Special thanks to:

- **🌟 Google AI Team** - For the incredible Gemini 2.5 Flash model
- **🎨 Streamlit Team** - For the amazing web framework
- **💚 Mental Health Community** - For inspiration, feedback, and support
- **👨‍💻 Open Source Contributors** - For making this project possible
- **❤️ You** - For caring about mental health and using MindfulChat

---

## 📞 Support & Contact

### Need Help?

- 📧 **Email**: support@mindfulchat.example.com
- 💬 **GitHub Issues**: [Report a bug](https://github.com/yourusername/mindfulchat/issues)
- 🐦 **Twitter**: [@MindfulChatAI](https://twitter.com/mindfulchatai)
- 🌐 **Website**: [mindfulchat.example.com](https://mindfulchat.example.com)

### Community

- 💬 **Discord**: [Join our community](#)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/yourusername/mindfulchat/discussions)
- 📱 **Reddit**: [r/MindfulChat](#)

---

## 🌟 Show Your Support

If you find MindfulChat helpful, please consider:

- ⭐ **Star this repository** on GitHub
- 🐦 **Share** on social media
- 📝 **Write** a blog post about your experience
- 💝 **Contribute** to the project
- ☕ **Buy me a coffee** (optional donation link)

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/mindfulchat?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/mindfulchat?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/mindfulchat)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/mindfulchat)

- **Lines of Code**: ~1000+
- **Files**: 10+
- **Languages**: Python, CSS, HTML
- **Dependencies**: 3 core packages
- **Version**: 2.0.0
- **Last Updated**: October 2025

---

## 🗺️ Roadmap

### Coming Soon

- [ ] 🌍 Multi-language support (Spanish, French, German, etc.)
- [ ] 📊 Enhanced mood tracking with graphs and insights
- [ ] 🎵 Guided meditation audio integration
- [ ] 📱 Progressive Web App (PWA) support
- [ ] 🌙 Dark mode toggle
- [ ] 💬 Voice input/output
- [ ] 📧 Email conversation summaries
- [ ] 🔗 Integration with mental health apps
- [ ] 🎯 Personalized coping strategy recommendations
- [ ] 📅 Appointment reminders for therapy sessions

### Future Ideas

- AI-powered mood pattern analysis
- Community forum (anonymous)
- Therapist matching service
- Mobile app (iOS/Android)
- Browser extension

---

<div align="center">

## 💜 Made with Love for Mental Wellness

**Supporting mental health, one conversation at a time**

---

### Remember: You're not alone. Your mental health matters. 🌈

*If you or someone you know is in crisis, please reach out for help immediately.*

**National Suicide Prevention Lifeline: 988 or 1-800-273-8255**

---

[⬆ Back to Top](#-mindfulchat---professional-mental-health-support-chatbot)

---

**© 2025 MindfulChat | Built with 💜 by Developers Who Care**

</div>
