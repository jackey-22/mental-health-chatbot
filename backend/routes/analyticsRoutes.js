const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getSentimentDistribution,
  getConversationHistory,
} = require('../controllers/analyticsController');

// Get comprehensive analytics
router.get('/', getAnalytics);

// Get sentiment distribution
router.get('/sentiment', getSentimentDistribution);

// Get conversation history
router.get('/conversations', getConversationHistory);

module.exports = router;
