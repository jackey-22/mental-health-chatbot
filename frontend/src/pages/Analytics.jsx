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
          background: '#faf9f7',
          gap: 3 
        }}>
          <CircularProgress size={60} sx={{ color: '#8a7cb4' }} />
          <Typography variant="h5" sx={{ color: '#8a7cb4', fontWeight: 500 }}>
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
    Positive: '#76c893', // Softer emerald
    Negative: '#f28482', // Softer coral/red
    Neutral: '#93a1ad',  // Muted blue-grey
  };

  const SENTIMENT_LIGHT_COLORS = {
    Positive: '#e8f5e9',
    Negative: '#ffebee',
    Neutral: '#f5f7f9',
  };

  const severityData = analytics.assessments.severityDistribution.map((item) => ({
    severity: item._id,
    count: item.count,
  }));

  const SEVERITY_COLORS = {
    Minimal: '#76c893',
    Mild: '#84a59d',
    Moderate: '#f7ede2',
    'Moderately Severe': '#f5cac3',
    Severe: '#f28482',
  };

  const SEVERITY_BAR_COLORS = {
    Minimal: '#a7d7c5',
    Mild: '#94d2bd',
    Moderate: '#e9edc9',
    'Moderately Severe': '#fbc4ab',
    Severe: '#ffb5a7',
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
      color: '#8a7cb4',
      bgColor: '#f3f0ff',
      trend: '+12% from last week',
      trendIcon: <ArrowUpward sx={{ fontSize: 14 }} />,
      trendColor: '#76c893',
    },
    {
      icon: <WarningIcon />,
      title: 'Crisis Interventions',
      value: analytics.overview.crisisInterventions,
      color: '#f28482',
      bgColor: '#fff1f0',
      trend: '-5% from last week',
      trendIcon: <ArrowDownward sx={{ fontSize: 14 }} />,
      trendColor: '#f28482',
    },
    {
      icon: <AssignmentIcon />,
      title: 'PHQ-9 Assessments',
      value: analytics.overview.totalAssessments,
      color: '#b2a4d4',
      bgColor: '#f8f7ff',
      trend: '+8% from last week',
      trendIcon: <ArrowUpward sx={{ fontSize: 14 }} />,
      trendColor: '#76c893',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Crisis Detection Rate',
      value: `${analytics.overview.crisisRate}%`,
      color: '#f6bd60',
      bgColor: '#fffcf2',
      trend: 'Accuracy rate',
      trendColor: '#93a1ad',
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
      <Box className="analytics-header" sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
              <Box className="header-icon-container" sx={{
                p: 2,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 }
              }}>
                <PsychologyIcon sx={{ fontSize: { xs: 28, md: 38 }, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ 
                  color: '#2d2d2d', 
                  fontWeight: 800, 
                  letterSpacing: '-0.02em',
                  mb: 0.5,
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
                }}>
                  Analytics
                </Typography>
                <Typography variant="body1" sx={{ color: '#5a5a5a', fontWeight: 400, fontSize: '1.1rem' }}>
                  Personal mental health insights and progress
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton 
                onClick={fetchData}
                sx={{ 
                  bgcolor: '#fff', 
                  color: '#8a7cb4',
                  boxShadow: '0 4px 12px rgba(138, 124, 180, 0.1)',
                  '&:hover': { transform: 'rotate(180deg)', bgcolor: '#fff' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Stat Cards Row - Now properly aligned and centered */}
        <Grid container spacing={3} sx={{ mb: 6, width: '100%', margin: 0 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ p: '12px !important' }}>
              <Box className="stat-card-glass" sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: stat.bgColor, 
                  borderRadius: '14px',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5
                }}>
                  {React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } })}
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ color: '#2d2d2d', fontWeight: 800, mb: 2, fontSize: '2.25rem' }}>
                  {stat.value}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: stat.trendColor,
                    bgcolor: `${stat.trendColor}15`,
                    px: 1,
                    py: 0.5,
                    borderRadius: '6px'
                  }}>
                    {stat.trendIcon}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {stat.trend}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ width: '100%', margin: 0 }}>
          {/* Sentiment Chart */}
          <Grid item xs={12} lg={8} sx={{ p: '16px !important' }}>
            <Typography variant="h5" className="analytics-section-title">
              Sentiment Distribution
            </Typography>
            <Card sx={{ p: { xs: 2, md: 4 } }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: { xs: 300, md: 350 }, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {sentimentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name]} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#2d2d2d' }}>
                        {analytics.overview.totalConversations}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#5a5a5a', fontWeight: 600 }}>
                        Total Chats
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    {sentimentChartData.map((sentiment, index) => (
                      <Box key={index} sx={{ 
                        p: 2, 
                        borderRadius: '16px', 
                        bgcolor: SENTIMENT_LIGHT_COLORS[sentiment.name],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateX(8px)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ color: SENTIMENT_COLORS[sentiment.name] }}>
                            {sentiment.icon}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2d2d2d' }}>
                              {sentiment.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#5a5a5a' }}>
                              {sentiment.value} conversations
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: SENTIMENT_COLORS[sentiment.name] }}>
                          {((sentiment.value / analytics.overview.totalConversations) * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Severity Trends */}
          <Grid item xs={12} lg={4} sx={{ p: '16px !important' }}>
            <Typography variant="h5" className="analytics-section-title">
              Weekly Progress
            </Typography>
            <Card sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  AVERAGE WELLBEING SCORE
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: '#8a7cb4' }}>
                    12.4
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#cbd5e0', fontWeight: 600 }}>
                    / 27
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 180, mt: 'auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8a7cb4" 
                      strokeWidth={4} 
                      dot={{ r: 5, fill: '#8a7cb4', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, strokeWidth: 0 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="body2" sx={{ mt: 4, color: '#5a5a5a', fontStyle: 'italic', textAlign: 'center', fontWeight: 300 }}>
                "Small steps every day lead to big changes."
              </Typography>
            </Card>
          </Grid>

          {/* Recent Assessments Table */}
          <Grid item xs={12} md={6} sx={{ p: '16px !important' }}>
            <Typography variant="h5" className="analytics-section-title">
              Recent Activity
            </Typography>
            <Card sx={{ p: 0, overflow: 'hidden' }}>
              <Stack spacing={0}>
                {assessmentHistory.slice(0, 5).map((assessment, index) => (
                  <Box key={index} sx={{ 
                    p: 2.5, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderBottom: index === 4 ? 'none' : '1px solid #f1f5f9',
                    '&:hover': { bgcolor: '#faf9f7' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 44, 
                        height: 44, 
                        borderRadius: '12px', 
                        bgcolor: `${SEVERITY_COLORS[assessment.severity]}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: SEVERITY_COLORS[assessment.severity]
                      }}>
                        <CalendarIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2d2d2d' }}>
                          {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#5a5a5a' }}>
                          {assessment.severity}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={`${assessment.score} / 27`} 
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        bgcolor: SEVERITY_COLORS[assessment.severity],
                        color: '#fff',
                        fontSize: '0.75rem'
                      }} 
                    />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>

          {/* Severity Bar Chart */}
          <Grid item xs={12} md={6} sx={{ p: '16px !important' }}>
            <Typography variant="h5" className="analytics-section-title">
              Severity Distribution
            </Typography>
            <Card sx={{ p: 4, height: '100%' }}>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="severity" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500, fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500, fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#faf9f7' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={32}>
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box className="recharts-default-tooltip">
        <Typography variant="body2" sx={{ fontWeight: 800, color: '#8a7cb4' }}>
          Score: {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default Analytics;