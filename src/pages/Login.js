import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  HealthAndSafety,
  ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import translations from '../utils/translations';

const Login = ({ onRegisterClick }) => {
  const { authenticateUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  
  
  React.useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);
  
  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { email, password } = formData;
      
      if (!email || !password) {
        setError('Por favor preencha todos os campos');
        setLoading(false);
        return;
      }
      
      const result = authenticateUser(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Falha ao fazer login');
      }
    } catch (err) {
      setError('Erro ao fazer login');
      console.error(err);
    }
    
    setLoading(false);
  };
  
  return (
    <Card
      elevation={24}
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        borderRadius: 4,
        overflow: 'hidden',
        height: '100%',
        transform: animateForm ? 'scale(1)' : 'scale(0.95)',
        opacity: animateForm ? 1 : 0,
        transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
      }}
    >
          {/* Left side - Branding Panel */}
          <Box
            sx={{
              flex: isMobile ? 'none' : '0 0 45%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              p: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              position: 'relative',
              overflow: 'hidden',
              minHeight: isMobile ? '180px' : 'auto',
            }}
          >
            {/* Decorative circles */}
            <Box sx={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: '-30px',
              right: '-30px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'white',
                color: theme.palette.primary.main,
                mb: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <HealthAndSafety sx={{ fontSize: 45 }} />
            </Avatar>
            
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                textAlign: 'center',
                mb: 1,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              {translations.appName}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.9,
                textAlign: 'center',
                maxWidth: '80%',
                textShadow: '0 1px 5px rgba(0,0,0,0.1)'
              }}
            >
              Seu assistente de gerenciamento de medicamentos pessoal
            </Typography>
          </Box>
          
          {/* Right side - Login Form */}
          <CardContent 
            sx={{
              flex: isMobile ? 'none' : '0 0 55%',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                color: theme.palette.text.primary,
              }}
            >
              Bem-vindo de volta
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              Faça login para gerenciar seus medicamentos
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                icon={<VisibilityOff fontSize="inherit" />}
              >
                {error}
              </Alert>
            )}
            
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderWidth: 2,
                    }
                  }
                }}
                variant="outlined"
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="senha"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderWidth: 2,
                    }
                  }
                }}
                variant="outlined"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,105,217,0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 6px 15px rgba(0,105,217,0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <LoginIcon sx={{ mr: 1 }} /> Login
                  </>
                )}
              </Button>
              
              <Box sx={{ mt: 4, mb: 2 }}>
                <Divider>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ px: 1, fontStyle: 'italic' }}
                  >
                    Você não tem uma conta?
                  </Typography>
                </Divider>
              </Box>
              
              <Button
                onClick={handleRegisterClick}
                fullWidth
                variant="outlined"
                color="primary"
                endIcon={<ArrowForward />}
                sx={{ 
                  py: 1.2,
                  borderRadius: 2,
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    transform: 'translateX(5px)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                Criar uma conta
              </Button>
            </Box>
          </CardContent>
    </Card>
  );
};

export default Login;
