import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import ElectronicTools from './pages/ElectronicTools';
import SoftwareTools from './pages/SoftwareTools';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      letterSpacing: '-0.01562em',
      marginBottom: '0.5em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      letterSpacing: '-0.00833em',
      marginBottom: '0.5em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      letterSpacing: '0em',
      marginBottom: '0.5em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0.00735em',
      marginBottom: '0.5em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '6px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <Navigation />
          <Container 
            component="main" 
            maxWidth="xl" 
            sx={{ 
              flexGrow: 1, 
              py: 4,
              px: { xs: 2, sm: 4 },
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/electronic-tools/*" element={<ElectronicTools />} />
              <Route path="/software-tools/*" element={<SoftwareTools />} />
            </Routes>
          </Container>
          <Box 
            component="footer" 
            sx={{ 
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: 'background.paper',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <Container maxWidth="xl">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                  {new Date().getFullYear()} Tech Toolbox. All rights reserved.
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 2,
                    '& a': {
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <a href="/about">About</a>
                  <a href="/privacy">Privacy</a>
                  <a href="/terms">Terms</a>
                  <a href="/contact">Contact</a>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
