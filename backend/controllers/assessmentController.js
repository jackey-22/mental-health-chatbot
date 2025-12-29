const Assessment = require('../models/Assessment');

// Calculate PHQ-9 severity based on total score
const calculateSeverity = (score) => {
  if (score >= 0 && score <= 4) return 'Minimal';
  if (score >= 5 && score <= 9) return 'Mild';
  if (score >= 10 && score <= 14) return 'Moderate';
  if (score >= 15 && score <= 19) return 'Moderately Severe';
  if (score >= 20 && score <= 27) return 'Severe';
  return 'Unknown';
};

// Submit PHQ-9 assessment
const submitAssessment = async (req, res) => {
  try {
    const { answers, userId } = req.body;

    // Validate input
    if (!answers || !Array.isArray(answers) || answers.length !== 9) {
      return res.status(400).json({
        error: 'Please provide exactly 9 answers',
      });
    }

    // Validate each answer is between 0-3
    const validAnswers = answers.every(ans => 
      typeof ans === 'number' && ans >= 0 && ans <= 3
    );

    if (!validAnswers) {
      return res.status(400).json({
        error: 'Each answer must be a number between 0 and 3',
      });
    }

    // Calculate total score
    const totalScore = answers.reduce((sum, ans) => sum + ans, 0);
    const severity = calculateSeverity(totalScore);

    // Save assessment
    const assessment = await Assessment.create({
      userId: userId || 'anonymous',
      answers,
      totalScore,
      severity,
    });

    // Return result with interpretation
    res.json({
      assessmentId: assessment._id,
      totalScore,
      severity,
      interpretation: getInterpretation(severity, totalScore),
      timestamp: assessment.createdAt,
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({
      error: 'Failed to submit assessment',
    });
  }
};

// Get interpretation and recommendations
const getInterpretation = (severity, score) => {
  const interpretations = {
    'Minimal': {
      message: 'Your responses suggest minimal depression symptoms. Continue to monitor your mental health and practice self-care.',
      recommendation: 'Maintain healthy habits like exercise, sleep, and social connections.',
    },
    'Mild': {
      message: 'Your responses suggest mild depression symptoms. Consider talking to someone you trust about how you\'re feeling.',
      recommendation: 'Consider lifestyle changes, stress management techniques, or talking to a counselor.',
    },
    'Moderate': {
      message: 'Your responses suggest moderate depression symptoms. It\'s recommended to speak with a mental health professional.',
      recommendation: 'Schedule an appointment with a therapist or counselor. Treatment can be very effective.',
    },
    'Moderately Severe': {
      message: 'Your responses suggest moderately severe depression symptoms. Professional help is strongly recommended.',
      recommendation: 'Please contact a mental health professional soon. Consider medication and therapy options.',
    },
    'Severe': {
      message: 'Your responses suggest severe depression symptoms. Immediate professional help is needed.',
      recommendation: 'Please contact a mental health professional or crisis helpline immediately. Your well-being is important.',
    },
  };

  return interpretations[severity] || {
    message: 'Unable to interpret results.',
    recommendation: 'Please consult a mental health professional.',
  };
};

// Get assessment history
const getAssessmentHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { userId } : {};
    const assessments = await Assessment.find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('totalScore severity createdAt');

    res.json({
      count: assessments.length,
      assessments: assessments.map(a => ({
        id: a._id,
        score: a.totalScore,
        severity: a.severity,
        date: a.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({
      error: 'Failed to fetch assessment history',
    });
  }
};

// Get PHQ-9 questions
const getQuestions = (req, res) => {
  const questions = [
    {
      id: 1,
      question: 'Have you had little interest or pleasure in doing things you usually enjoy?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 2,
      question: 'Have you been feeling down, depressed, or hopeless?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 3,
      question: 'Have you had trouble falling asleep, staying asleep, or sleeping too much?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 4,
      question: 'Have you been feeling tired or having little energy?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 5,
      question: 'Have you had changes in your appetite - eating too much or too little?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 6,
      question: 'Have you been feeling bad about yourself or feeling like you\'ve let yourself or your family down?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 7,
      question: 'Have you had trouble concentrating on things like reading or watching TV?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 8,
      question: 'Have you been moving or speaking so slowly that others noticed? Or being so restless that you\'re moving around more than usual?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 9,
      question: 'Have you had thoughts that you would be better off not being here, or thoughts of hurting yourself?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
  ];

  res.json({
    title: 'PHQ-9 Depression Screening',
    description: 'Over the last 2 weeks, how often have you experienced any of the following?',
    questions,
  });
};

module.exports = {
  submitAssessment,
  getAssessmentHistory,
  getQuestions,
};
