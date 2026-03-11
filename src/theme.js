import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7b1fa2', // Purple theme for a modern crypto vibe
      light: '#ae52d4',
      dark: '#4a0072',
    },
    secondary: {
      main: '#00e676', // Bright green for accents and positive changes
    },
    background: {
      default: '#0a1929', // Deep dark blue background
      paper: '#001e3c', // Slightly lighter dark blue for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#b2bac2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #7b1fa2 30%, #00e676 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      },
    },
  },
});

export default theme;
