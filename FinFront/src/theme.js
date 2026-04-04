import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#818cf8' : '#4f46e5',
      },
      secondary: {
        main: mode === 'dark' ? '#38bdf8' : '#0ea5e9',
      },
      success: {
        main: mode === 'dark' ? '#34d399' : '#10b981',
      },
      error: {
        main: mode === 'dark' ? '#fb7185' : '#f43f5e',
      },
      warning: {
        main: mode === 'dark' ? '#fbbf24' : '#f59e0b',
      },
      background: {
        default: mode === 'dark' ? '#09090b' : '#f0fdf4',
        paper: mode === 'dark' ? 'rgba(24, 24, 27, 0.65)' : 'rgba(255, 255, 255, 0.7)',
      },
      text: {
        primary: mode === 'dark' ? '#fafafa' : '#0f172a',
        secondary: mode === 'dark' ? '#a1a1aa' : '#64748b',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    },
    typography: {
      fontFamily: "'Outfit', sans-serif",
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontWeight: 600, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
      body1: { letterSpacing: '0.01em' },
      body2: { letterSpacing: '0.01em' }
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            padding: '10px 24px',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            textTransform: 'none',
            '&:hover': {
              boxShadow: '0 8px 20px -6px rgba(0,0,0,0.2)',
              transform: 'translateY(-2px)',
            },
          },
          containedPrimary: {
            background: mode === 'dark' ? 'linear-gradient(135deg, #818cf8 0%, #38bdf8 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
            color: '#fff',
            '&:hover': {
               // Keeps the gradient on hover
               background: mode === 'dark' ? 'linear-gradient(135deg, #818cf8 0%, #38bdf8 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
            }
          }
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove weird overlay in dark mode MUI
            backgroundColor: 'transparent',
            boxShadow: 'none', // Managed by our CSS utility classes instead
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: 'transparent',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          }
        }
      }
    },
  });
};
