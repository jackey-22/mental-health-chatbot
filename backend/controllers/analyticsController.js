const Chat = require('../models/Chat');
const Assessment = require('../models/Assessment');

// Get comprehensive analytics
const getAnalytics = async (req, res) => {
  try {
    // Total conversations
    const totalConversations = await Chat.countDocuments();

    // Crisis interventions
    const crisisCount = await Chat.countDocuments({ isCrisis: true });

    // Sentiment statistics
    const sentimentStats = await Chat.aggregate([
      {
        $group: {
          _id: '$sentiment.label',
          count: { $sum: 1 },
          avgScore: { $avg: '$sentiment.score' },
        },
      },
    ]);

    // Recent conversations with sentiment
    const recentChats = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('sentiment.label sentiment.score createdAt isCrisis');

    // Assessment statistics
    const totalAssessments = await Assessment.countDocuments();
    const severityDistribution = await Assessment.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
          avgScore: { $avg: '$totalScore' },
        },
      },
    ]);

    // Recent assessments
    const recentAssessments = await Assessment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('totalScore severity createdAt');

    // Sentiment trends over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sentimentTrends = await Chat.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            sentiment: '$sentiment.label',
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$sentiment.score' },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    // Calculate overall sentiment score average
    const overallSentiment = await Chat.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$sentiment.score' },
          avgComparative: { $avg: '$sentiment.comparative' },
        },
      },
    ]);

    res.json({
      overview: {
        totalConversations,
        crisisInterventions: crisisCount,
        totalAssessments,
        crisisRate: totalConversations > 0 ? ((crisisCount / totalConversations) * 100).toFixed(2) : 0,
      },
      sentiment: {
        distribution: sentimentStats,
        overall: overallSentiment[0] || { avgScore: 0, avgComparative: 0 },
        trends: sentimentTrends,
      },
      assessments: {
        severityDistribution,
        recent: recentAssessments,
      },
      recentActivity: {
        conversations: recentChats,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
    });
  }
};

// Get sentiment distribution
const getSentimentDistribution = async (req, res) => {
  try {
    const distribution = await Chat.aggregate([
      {
        $group: {
          _id: '$sentiment.label',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ distribution });
  } catch (error) {
    console.error('Error fetching sentiment distribution:', error);
    res.status(500).json({
      error: 'Failed to fetch sentiment distribution',
    });
  }
};

// Get conversation history with sentiment
const getConversationHistory = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const conversations = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('userMessage botReply sentiment isCrisis createdAt');

    res.json({
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation history',
    });
  }
};

module.exports = {
  getAnalytics,
  getSentimentDistribution,
  getConversationHistory,
};
