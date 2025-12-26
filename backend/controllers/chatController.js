const Chat = require('../models/Chat');
const { getChatResponse } = require('../services/geminiService');

// Crisis keywords to detect
const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'self harm',
  'end my life',
  'i want to die',
  // Additional safety keywords for comprehensive protection
  'take my life',
  'end it all',
];

// Check if message contains crisis keywords
const detectCrisis = (message) => {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
};

// Crisis response with helpline information
const getCrisisResponse = () => {
  return {
    reply: `I'm really concerned about what you're sharing. Your life has value, and there are people who want to help you.

Please reach out to someone you trust right now - a friend, family member, or a mental health professional.

If you need immediate support, please contact:

🇮🇳 India Helpline: +91-9152987821
🌍 Global Helplines: https://findahelpline.com

You don't have to go through this alone. There is help available, and things can get better.`,
    isCrisis: true,
  };
};

// Main chat controller
const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide a valid message',
      });
    }

    const userMessage = message.trim();

    // Crisis detection - MUST happen before Gemini API call
    if (detectCrisis(userMessage)) {
      const crisisResponse = getCrisisResponse();

      // Save to database
      await Chat.create({
        userMessage,
        botReply: crisisResponse.reply,
        isCrisis: true,
      });

      return res.json({
        reply: crisisResponse.reply,
      });
    }

    // Normal flow: Get response from Gemini API
    let botReply;
    try {
      botReply = await getChatResponse(userMessage);
    } catch (error) {
      // Never expose raw Gemini API errors to users
      console.error('Error getting AI response:', error);
      botReply =
        "I'm having trouble processing that right now. Please try again in a moment, or consider reaching out to a mental health professional for support.";
    }

    // Save conversation to database
    await Chat.create({
      userMessage,
      botReply,
      isCrisis: false,
    });

    // Return response
    res.json({
      reply: botReply,
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    });
  }
};

module.exports = { chatController };

