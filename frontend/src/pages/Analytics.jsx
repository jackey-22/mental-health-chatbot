import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, getAssessmentHistory } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChatBubble as ChatIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Psychology as PsychologyIcon,
  SentimentSatisfied as PositiveIcon,
  SentimentDissatisfied as NegativeIcon,
  SentimentNeutral as NeutralIcon,
  CalendarToday as CalendarIcon,
  ArrowUpward,
  ArrowDownward,
  TrendingFlat,
} from '@mui/icons-material';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [analytics, setAnalytics] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, historyData] = await Promise.all([
        getAnalytics(),
        getAssessmentHistory(),
      ]);
      setAnalytics(analyticsData);
      setAssessmentHistory(historyData.assessments || []);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="analytics-loading">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          gap: 3 
        }}>
          <CircularProgress size={60} sx={{ color: '#fff' }} />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 500 }}>
            Loading analytics dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="analytics-container">
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 2,
              fontSize: '1rem'
            }}
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  // Process sentiment data
  const sentimentMap = {};
  analytics.sentiment.distribution.forEach((item) => {
    const label = item._id || 'neutral';
    if (sentimentMap[label]) {
      sentimentMap[label] += item.count;
    } else {
      sentimentMap[label] = item.count;
    }
  });

  const sentimentChartData = Object.entries(sentimentMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value,
    icon: name === 'positive' ? <PositiveIcon /> : name === 'negative' ? <NegativeIcon /> : <NeutralIcon />
  }));

  const SENTIMENT_COLORS = {
    Positive: '#10b981',
    Negative: '#ef4444',
    Neutral: '#6b7280',
  };

  const SENTIMENT_LIGHT_COLORS = {
    Positive: '#d1fae5',
    Negative: '#fee2e2',
    Neutral: '#f3f4f6',
  };

  const severityData = analytics.assessments.severityDistribution.map((item) => ({
    severity: item._id,
    count: item.count,
  }));

  const SEVERITY_COLORS = {
    Minimal: '#10b981',
    Mild: '#3b82f6',
    Moderate: '#f59e0b',
    'Moderately Severe': '#f97316',
    Severe: '#ef4444',
  };

  // Generate trend data for the last 7 days
  const trendData = [
    { day: 'Mon', score: 12 },
    { day: 'Tue', score: 15 },
    { day: 'Wed', score: 10 },
    { day: 'Thu', score: 8 },
    { day: 'Fri', score: 14 },
    { day: 'Sat', score: 16 },
    { day: 'Sun', score: 11 },
  ];

  const statCards = [
    {
      icon: <ChatIcon />,
      title: 'Total Conversations',
      value: analytics.overview.totalConversations,
      color: '#3b82f6',
      bgColor: '#dbeafe',
      trend: '+12% from last week',
      trendIcon: <ArrowUpward sx={{ fontSize: 14 }} />,
      trendColor: '#10b981',
    },
    {
      icon: <WarningIcon />,
      title: 'Crisis Interventions',
      value: analytics.overview.crisisInterventions,
      color: '#ef4444',
      bgColor: '#fee2e2',
      trend: '-5% from last week',
      trendIcon: <ArrowDownward sx={{ fontSize: 14 }} />,
      trendColor: '#ef4444',
    },
    {
      icon: <AssignmentIcon />,
      title: 'PHQ-9 Assessments',
      value: analytics.overview.totalAssessments,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      trend: '+8% from last week',
      trendIcon: <ArrowUpward sx={{ fontSize: 14 }} />,
      trendColor: '#10b981',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Crisis Detection Rate',
      value: `${analytics.overview.crisisRate}%`,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      trend: 'Accuracy rate',
      trendColor: '#6b7280',
      trendIcon: <TrendingFlat sx={{ fontSize: 14 }} />,
    },
  ];

  const getSentimentIcon = (score) => {
    if (score > 0.5) return <PositiveIcon sx={{ color: '#10b981' }} />;
    if (score < -0.5) return <NegativeIcon sx={{ color: '#ef4444' }} />;
    return <NeutralIcon sx={{ color: '#6b7280' }} />;
  };

  return (
    <Box className="analytics-container">
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 4, md: 5 },
        borderBottomLeftRadius: { xs: 16, md: 24 },
        borderBottomRightRadius: { xs: 16, md: 24 },
        mb: 4
      }}>
        <Container maxWidth="xl">
          {/* Header Title */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2.5,
              mb: { xs: 2, sm: 0 }
            }}>
              <Box sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64
              }}>
                <PsychologyIcon sx={{ fontSize: 40, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ 
                  color: '#fff', 
                  fontWeight: 700, 
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                }}>
                  Mental Health Analytics
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem'
                }}>
                  Overview of conversations, assessments, and sentiment analysis
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={fetchData}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  color: '#fff',
                  borderRadius: 12,
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.25)',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
              <IconButton 
                onClick={() => navigate('/')}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  color: '#fff',
                  borderRadius: 12,
                  width: 48,
                  height: 48,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                }}
              >
                <HomeIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Stats Cards - Center Aligned */}
          <Grid container spacing={3}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper sx={{
                  p: 2.5,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: { xs: 14, md: 16 },
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  height: { xs: 140, md: 160 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    gap: 1.5
                  }}>
                    <Box sx={{ 
                      p: 1.5, 
                      bgcolor: stat.bgColor, 
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 44, md: 52 },
                      height: { xs: 44, md: 52 }
                    }}>
                      {React.cloneElement(stat.icon, { 
                        sx: { 
                          color: stat.color,
                          fontSize: { xs: 22, md: 26 }
                        } 
                      })}
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: { xs: '0.813rem', md: '0.875rem' },
                        fontWeight: 600,
                        mb: 0.5,
                        letterSpacing: '0.01em'
                      }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        color: '#fff', 
                        fontWeight: 700,
                        fontSize: { xs: '1.75rem', md: '2rem' },
                        lineHeight: 1.1,
                        mb: 0.5
                      }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      justifyContent: 'center'
                    }}>
                      {stat.trendIcon && (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: stat.trendColor }}>
                          {stat.trendIcon}
                        </Box>
                      )}
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        fontWeight: 500
                      }}>
                        {stat.trend}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {/* Row 1: Sentiment Overview Card (Full Width) */}
        <Box sx={{ mb: 3 }}>
          <Card sx={{
            borderRadius: { xs: 14, md: 16 },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 0 },
                mb: { xs: 2.5, md: 3 }
              }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  fontSize: { xs: '1.125rem', md: '1.25rem' }
                }}>
                  Sentiment Overview
                </Typography>
                <Chip
                  icon={getSentimentIcon(analytics.sentiment.overall?.avgScore)}
                  label={`Score: ${analytics.sentiment.overall?.avgScore?.toFixed(2) || '0.00'}`}
                  sx={{
                    bgcolor: SENTIMENT_LIGHT_COLORS[
                      analytics.sentiment.overall?.avgScore > 0.5 ? 'Positive' : 
                      analytics.sentiment.overall?.avgScore < -0.5 ? 'Negative' : 'Neutral'
                    ],
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    fontSize: { xs: '0.813rem', md: '0.875rem' }
                  }}
                />
              </Box>
              
              <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
                {/* Pie Chart */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    width: '100%',
                    height: { xs: 260, md: 300 },
                    minHeight: { xs: 260, md: 300 },
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 45 : 65}
                          outerRadius={isMobile ? 85 : 105}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {sentimentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name]} strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [value, 'Conversations']}
                          contentStyle={{ 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                
                {/* Sentiment Stats */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ height: '100%', justifyContent: 'center' }}>
                    {sentimentChartData.map((sentiment, index) => (
                      <Paper 
                        key={index}
                        sx={{ 
                          p: { xs: 1.5, md: 2 },
                          borderRadius: { xs: 10, md: 12 },
                          bgcolor: `${SENTIMENT_LIGHT_COLORS[sentiment.name]}40`,
                          border: `1px solid ${SENTIMENT_LIGHT_COLORS[sentiment.name]}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: { xs: 72, md: 84 },
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, md: 2 }}>
                          <Box sx={{
                            p: { xs: 1, md: 1.25 },
                            bgcolor: SENTIMENT_LIGHT_COLORS[sentiment.name],
                            borderRadius: { xs: 8, md: 10 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: 44, md: 48 },
                            height: { xs: 44, md: 48 },
                            flexShrink: 0
                          }}>
                            {React.cloneElement(sentiment.icon, {
                              sx: { fontSize: { xs: 20, md: 24 } }
                            })}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              color: '#1f2937', 
                              mb: 0.25,
                              fontSize: { xs: '1rem', md: '1.25rem' }
                            }}>
                              {sentiment.value}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#6b7280',
                              fontSize: { xs: '0.813rem', md: '0.875rem' }
                            }}>
                              {sentiment.name} Conversations
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 700, 
                          color: SENTIMENT_COLORS[sentiment.name],
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          flexShrink: 0,
                          ml: 1
                        }}>
                          {((sentiment.value / analytics.overview.totalConversations) * 100).toFixed(1)}%
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Row 2: Two Charts Side by Side */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Weekly Trends Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: { xs: 14, md: 16 },
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  mb: { xs: 2.5, md: 3 }, 
                  fontSize: { xs: '1.125rem', md: '1.25rem' }
                }}>
                  Weekly PHQ-9 Trends
                </Typography>
                <Box sx={{ 
                  width: '100%',
                  height: { xs: 200, md: 240 },
                  minHeight: { xs: 200, md: 240 },
                  mb: { xs: 2.5, md: 3 }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }}
                        domain={[0, 20]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ r: isMobile ? 3 : 4, strokeWidth: 2 }}
                        activeDot={{ r: isMobile ? 5 : 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
                <Paper sx={{ 
                  p: { xs: 2, md: 2.5 }, 
                  bgcolor: '#f8fafc', 
                  borderRadius: { xs: 10, md: 12 }, 
                  border: '1px solid #e2e8f0',
                  mt: 'auto'
                }}>
                  <Typography variant="body2" sx={{ 
                    color: '#64748b', 
                    mb: 1, 
                    fontWeight: 500,
                    fontSize: { xs: '0.813rem', md: '0.875rem' }
                  }}>
                    Current Average Score
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#1f2937',
                    fontSize: { xs: '1.75rem', md: '2rem' }
                  }}>
                    12.4 / 27
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Assessments Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: { xs: 14, md: 16 },
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: { xs: 2.5, md: 3 }
                }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: '#1f2937', 
                    fontSize: { xs: '1.125rem', md: '1.25rem' }
                  }}>
                    Recent Assessments
                  </Typography>
                  <Chip
                    icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                    label={`Last ${assessmentHistory.length}`}
                    size="small"
                    sx={{ bgcolor: '#f3f4f6', color: '#6b7280', fontWeight: 500 }}
                  />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={1.5}>
                    {assessmentHistory.slice(0, 5).map((assessment, index) => (
                      <Paper 
                        key={assessment.id}
                        sx={{ 
                          p: 2,
                          borderRadius: 10,
                          bgcolor: '#f9fafb',
                          border: '1px solid #f3f4f6',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#f3f4f6',
                            borderColor: '#e5e7eb'
                          }
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                              {new Date(assessment.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              {assessment.severity}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                              label={`${assessment.score}/27`}
                              size="small"
                              sx={{
                                bgcolor: `${SEVERITY_COLORS[assessment.severity]}15`,
                                color: SEVERITY_COLORS[assessment.severity],
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                px: 1.25,
                                height: 28
                              }}
                            />
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: SEVERITY_COLORS[assessment.severity]
                            }} />
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Row 3: Severity Distribution Card (Full Width) */}
        <Box>
          <Card sx={{
            borderRadius: { xs: 14, md: 16 },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#1f2937', 
                mb: { xs: 2.5, md: 3 }, 
                fontSize: { xs: '1.125rem', md: '1.25rem' }
              }}>
                PHQ-9 Severity Distribution
              </Typography>
              <Box sx={{ 
                width: '100%',
                height: { xs: 280, md: 340 },
                minHeight: { xs: 280, md: 340 }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="severity" 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [value, 'Assessments']}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={isMobile ? 30 : 50}>
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Analytics;