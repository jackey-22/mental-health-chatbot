const Chat = require('../models/Chat');
const { getChatResponse } = require('../services/geminiService');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

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

India Helpline: +91-9152987821
Global Helplines: https://findahelpline.com

You don't have to go through this alone. There is help available, and things can get better.`,
    isCrisis: true,
  };
};

// Main chat controller
const chatController = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide a valid message',
      });
    }

    const userMessage = message.trim();

    // Crisis detection - MUST happen before sentiment analysis
    const isCrisisMessage = detectCrisis(userMessage);

    // Analyze sentiment of user message
    let sentimentData;
    if (isCrisisMessage) {
      // Override sentiment for crisis messages - they are always highly negative
      sentimentData = {
        score: -10, // Strong negative score for crisis
        comparative: -1.5,
        label: 'negative',
      };
    } else {
      // Normal sentiment analysis
      const sentimentResult = sentiment.analyze(userMessage);
      let sentimentLabel = 'neutral';
      if (sentimentResult.score > 0) sentimentLabel = 'positive';
      else if (sentimentResult.score < 0) sentimentLabel = 'negative';

      sentimentData = {
        score: sentimentResult.score,
        comparative: sentimentResult.comparative,
        label: sentimentLabel,
      };
    }

    // Handle crisis messages
    if (isCrisisMessage) {
      const crisisResponse = getCrisisResponse();

      // Save to database
      await Chat.create({
        userMessage,
        botReply: crisisResponse.reply,
        isCrisis: true,
        sentiment: sentimentData,
      });

      return res.json({
        reply: crisisResponse.reply,
      });
    }

    // Normal flow: Get response from Gemini API with conversation history
    let botReply;
    try {
      botReply = await getChatResponse(userMessage, conversationHistory || []);
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
      sentiment: sentimentData,
    });

    // Return response
    res.json({
      reply: botReply,
      sentiment: sentimentData,
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    });
  }
};

module.exports = { chatController };

