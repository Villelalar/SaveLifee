import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const showRegister = location.pathname === '/register';
    setIsFlipped(showRegister);
  }, [location.pathname]);

  const handleFlip = (showRegister) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(showRegister);

    const newPath = showRegister ? '/register' : '/login';
    navigate(newPath, { replace: true });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); 
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
        padding: 2,
        perspective: '1000px', 
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4,
          transformStyle: 'preserve-3d', 
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: isMobile ? 'auto' : '600px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s ease',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          }}
        >
          {/* Login Side */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden', // For Safari
              transform: 'rotateY(0deg)',
            }}
          >
            <Login onRegisterClick={() => handleFlip(true)} />
          </Box>
          
          {/* Register Side */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)',
            }}
          >
            <Register onLoginClick={() => handleFlip(false)} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;
