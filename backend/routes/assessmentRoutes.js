const express = require('express');
const router = express.Router();
const {
  submitAssessment,
  getAssessmentHistory,
  getQuestions,
} = require('../controllers/assessmentController');

// Get PHQ-9 questions
router.get('/questions', getQuestions);

// Submit PHQ-9 assessment
router.post('/submit', submitAssessment);

// Get assessment history
router.get('/history', getAssessmentHistory);

module.exports = router;
