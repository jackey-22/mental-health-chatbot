import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Assessment from './pages/Assessment';
import Analytics from './pages/Analytics';
import FloatingDock from './components/FloatingDock';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8a9cf9',
      dark: '#4c5fd7',
    },
    secondary: {
      main: '#764ba2',
      light: '#9b6fc7',
      dark: '#5a3680',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
          <FloatingDock />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

