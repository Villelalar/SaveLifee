import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, alpha } from '@mui/material/styles';
import { animations } from '../theme/animations';

// Create theme based on mode (light/dark)
const createAppTheme = (mode) => {
  const isLight = mode === 'light';
  
  // Common colors for both themes
  const primaryMain = '#1976d2';
  const secondaryMain = '#0288d1';
  const accentColor = '#03a9f4';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        light: isLight ? '#64b5f6' : '#90caf9',
        main: primaryMain,
        dark: isLight ? '#1976d2' : '#1565c0',
        contrastText: '#fff',
      },
      secondary: {
        light: isLight ? '#4dd0e1' : '#80deea',
        main: secondaryMain,
        dark: isLight ? '#0097a7' : '#00838f',
        contrastText: '#fff',
      },
      background: {
        default: isLight ? '#f5f7fa' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
        subtle: isLight ? '#f0f4f8' : '#272727',
      },
      text: {
        primary: isLight ? '#2c3e50' : '#e0e0e0',
        secondary: isLight ? '#546e7a' : '#b0bec5',
      },
      divider: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
      action: {
        hover: isLight ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.16)',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      subtitle1: {
        letterSpacing: '0.005em',
      },
      subtitle2: {
        fontWeight: 500,
        letterSpacing: '0.005em',
      },
    },
    shape: {
      borderRadius: 16,
    },
    // Custom theme properties for animations
    customAnimations: animations,
    shadows: [
      'none',
      isLight 
        ? '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.07)'
        : '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.12)',
      ...Array(23).fill(''),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: isLight ? '#bfbfbf #f1f1f1' : '#555555 #2c2c2c',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight ? '#f1f1f1' : '#2c2c2c',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isLight ? '#bfbfbf' : '#555555',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: isLight ? '#a0a0a0' : '#707070',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? primaryMain : '#1a1a1a',
            backgroundImage: isLight 
              ? 'none'
              : `linear-gradient(to right, ${primaryMain}, ${alpha(secondaryMain, 0.8)})`,
            boxShadow: isLight 
              ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)'
              : '0 1px 3px rgba(0,0,0,0.24), 0 1px 2px rgba(0,0,0,0.28)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
            backgroundImage: isLight 
              ? 'none'
              : `linear-gradient(to bottom, #1a1a1a, #212121)`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 20px',
            transition: 'all 0.3s ease',
          },
          contained: {
            boxShadow: isLight 
              ? '0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)'
              : '0 2px 4px rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.24)',
            '&:hover': {
              boxShadow: isLight 
                ? '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
                : '0 4px 8px rgba(0,0,0,0.24), 0 2px 4px rgba(0,0,0,0.16)',
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${primaryMain}, ${accentColor})`,
            '&:hover': {
              background: `linear-gradient(135deg, ${primaryMain}, ${secondaryMain})`,
              transform: 'translateY(-2px)',
              boxShadow: isLight 
                ? '0 6px 12px rgba(25, 118, 210, 0.3), 0 3px 6px rgba(25, 118, 210, 0.2)'
                : '0 6px 12px rgba(25, 118, 210, 0.4), 0 3px 6px rgba(25, 118, 210, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: isLight 
              ? '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)'
              : '0 2px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: isLight 
                ? '0 6px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)'
                : '0 6px 12px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 16,
          },
          elevation1: {
            boxShadow: isLight 
              ? '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)'
              : '0 2px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: isLight 
                ? alpha(primaryMain, 0.12)
                : alpha(primaryMain, 0.24),
              '&:hover': {
                backgroundColor: isLight 
                  ? alpha(primaryMain, 0.18)
                  : alpha(primaryMain, 0.32),
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 48,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          outlined: {
            borderRadius: 8,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            margin: '16px 0',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isLight ? '#424242' : '#f5f5f5',
            color: isLight ? '#fff' : '#212121',
            fontSize: '0.75rem',
            borderRadius: 4,
            boxShadow: isLight 
              ? '0 2px 8px rgba(0,0,0,0.15)'
              : '0 2px 8px rgba(0,0,0,0.3)',
          },
        },
      },
    },
  });
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check if user has a preference stored
  const storedMode = localStorage.getItem('themeMode');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Initialize with stored preference or system preference
  const [mode, setMode] = useState(storedMode || (prefersDarkMode ? 'dark' : 'light'));
  
  // Create theme based on current mode
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
