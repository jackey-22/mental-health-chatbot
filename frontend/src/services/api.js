import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message, conversationHistory = []) => {
  try {
    const response = await api.post('/chat', { 
      message,
      conversationHistory 
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to send message. Please try again.'
    );
  }
};

// Assessment APIs
export const getAssessmentQuestions = async () => {
  try {
    const response = await api.get('/assessment/questions');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch assessment questions');
  }
};

export const submitAssessment = async (answers, userId = 'anonymous') => {
  try {
    const response = await api.post('/assessment/submit', { answers, userId });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to submit assessment'
    );
  }
};

export const getAssessmentHistory = async (userId) => {
  try {
    const params = userId ? { userId } : {};
    const response = await api.get('/assessment/history', { params });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch assessment history');
  }
};

// Analytics APIs
export const getAnalytics = async () => {
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch analytics');
  }
};

export const getSentimentDistribution = async () => {
  try {
    const response = await api.get('/analytics/sentiment');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch sentiment distribution');
  }
};

export const getConversationHistory = async (limit = 20) => {
  try {
    const response = await api.get('/analytics/conversations', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch conversation history');
  }
};

export default api;

