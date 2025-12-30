import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessmentQuestions, submitAssessment } from '../services/api';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  IconButton,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
  CheckCircle as CheckIcon,
  Psychology as PsychologyIcon,
  Phone as PhoneIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as RecommendationIcon,
  ReportProblem as WarningIcon
} from '@mui/icons-material';
import './Assessment.css';

const Assessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getAssessmentQuestions();
      setQuestions(data.questions || []);
    } catch (err) {
      setError('Failed to load assessment questions');
    }
  };

  const handleAnswerSelect = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(ans => ans === null)) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const resultData = await submitAssessment(answers);
      setResult(resultData);
    } catch (err) {
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setAnswers(Array(9).fill(null));
    setResult(null);
    setCurrentStep(0);
    setError('');
  };

  if (result) {
    const severityColors = {
      Minimal: '#4caf50',
      Mild: '#2196f3',
      Moderate: '#ff9800',
      'Moderately Severe': '#ff5722',
      Severe: '#f44336',
    };

    return (
      <Box className="assessment-container">
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/')}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <HomeIcon />
            </IconButton>
          </Box>

          <Card 
            elevation={0}
            sx={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CheckIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                  Assessment Complete
                </Typography>
                
                <Chip
                  label={result.severity}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    px: 4,
                    py: 3,
                    height: 'auto',
                    bgcolor: `${severityColors[result.severity]}15`,
                    color: severityColors[result.severity],
                    mb: 3,
                  }}
                />

                <Paper 
                  sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, rgba(138, 124, 180, 0.1), rgba(155, 143, 197, 0.1))',
                    border: '2px solid rgba(138, 124, 180, 0.2)',
                    borderRadius: '24px'
                  }}
                >
                  <Typography variant="h2" sx={{ fontWeight: 900, color: '#8a7cb4' }}>
                    {result.totalScore}
                    <Typography component="span" variant="h4" sx={{ color: '#64748b' }}>
                      {' '}/27
                    </Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                    Total PHQ-9 Score
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon /> What This Means:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="body1" sx={{ color: '#475569' }}>
                    {result.interpretation.message}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RecommendationIcon /> Recommendation:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="body1" sx={{ color: '#475569' }}>
                    {result.interpretation.recommendation}
                  </Typography>
                </Paper>
              </Box>

              {result.totalScore >= 15 && (
                <Alert 
                  severity="warning" 
                  icon={<PhoneIcon />}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon fontSize="small" /> Important Resources:
                  </Typography>
                  <Typography variant="body2">
                    India Helpline: <strong>+91-9152987821</strong><br />
                    Global Helplines: <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8a7cb4', fontWeight: 600 }}>findahelpline.com</a>
                  </Typography>
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={resetAssessment}
                  sx={{
                    background: 'linear-gradient(135deg, #8a7cb4 0%, #9b8fc5 100%)',
                    fontWeight: 600,
                    px: 4,
                    borderRadius: '50px',
                    boxShadow: '0 4px 16px rgba(138, 124, 180, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9b8fc5 0%, #ac9fd6 100%)',
                    }
                  }}
                >
                  Take Another Assessment
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/analytics')}
                  sx={{
                    borderColor: '#8a7cb4',
                    color: '#8a7cb4',
                    fontWeight: 600,
                    px: 4,
                    borderRadius: '50px',
                    '&:hover': {
                      borderColor: '#9b8fc5',
                      bgcolor: 'rgba(138, 124, 180, 0.05)',
                    }
                  }}
                >
                  View Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box className="assessment-container">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#8a7cb4' }}>Loading assessment...</Typography>
        </Box>
      </Box>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Box className="assessment-container">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PsychologyIcon sx={{ fontSize: 40, color: '#8a7cb4' }} />
            <Typography variant="h4" sx={{ color: '#2d2d2d', fontWeight: 700 }}>
              PHQ-9 Assessment
            </Typography>
          </Box>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              bgcolor: 'rgba(138, 124, 180, 0.1)', 
              color: '#8a7cb4',
              '&:hover': { bgcolor: 'rgba(138, 124, 180, 0.2)' }
            }}
          >
            <HomeIcon />
          </IconButton>
        </Box>

        <Card 
          elevation={0}
          sx={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 3, textAlign: 'center' }}>
              Over the last 2 weeks, how often have you been bothered by the following?
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(138, 124, 180, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #8a7cb4 0%, #9b8fc5 100%)',
                    borderRadius: 4,
                  }
                }}
              />
              <Typography variant="body2" sx={{ color: '#64748b', mt: 1, textAlign: 'center' }}>
                Question {currentStep + 1} of {questions.length}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, textAlign: 'center' }}>
                {currentQuestion.question}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={answers[currentStep] === option.value ? 'contained' : 'outlined'}
                    size="large"
                    onClick={() => handleAnswerSelect(currentStep, option.value)}
                    sx={{
                      py: 2,
                      px: 3,
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '1rem',
                      ...(answers[currentStep] === option.value ? {
                        background: 'linear-gradient(135deg, #8a7cb4 0%, #9b8fc5 100%)',
                        boxShadow: '0 4px 20px rgba(138, 124, 180, 0.4)',
                      } : {
                        borderColor: 'rgba(138, 124, 180, 0.2)',
                        color: '#475569',
                        '&:hover': {
                          borderColor: '#8a7cb4',
                          bgcolor: 'rgba(138, 124, 180, 0.05)',
                        }
                      })
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
            </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PreviousIcon />}
                onClick={handlePrevious}
                disabled={currentStep === 0}
                sx={{
                  borderColor: 'rgba(138, 124, 180, 0.3)',
                  color: '#8a7cb4',
                  fontWeight: 600,
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: '#8a7cb4',
                    bgcolor: 'rgba(138, 124, 180, 0.05)',
                  }
                }}
              >
                Previous
              </Button>
              
              {currentStep < questions.length - 1 ? (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<NextIcon />}
                  onClick={handleNext}
                  disabled={answers[currentStep] === null}
                  sx={{
                    background: 'linear-gradient(135deg, #8a7cb4 0%, #9b8fc5 100%)',
                    fontWeight: 600,
                    px: 4,
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(138, 124, 180, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9b8fc5 0%, #ac9fd6 100%)',
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<CheckIcon />}
                  onClick={handleSubmit}
                  disabled={loading || answers.some(ans => ans === null)}
                  sx={{
                    background: 'linear-gradient(135deg, #8a7cb4 0%, #9b8fc5 100%)',
                    fontWeight: 600,
                    px: 4,
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(138, 124, 180, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9b8fc5 0%, #ac9fd6 100%)',
                    }
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Assessment;
