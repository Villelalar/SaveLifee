import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  PersonAdd,
  Visibility,
  VisibilityOff,
  Person,
  MedicalInformation,
  SupervisorAccount,
  HealthAndSafety,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import translations from '../utils/translations';

const Register = ({ onLoginClick }) => {
  const { register, USER_TYPES } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: USER_TYPES.CLIENT,
    phone: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    specializations: '',
    responsibleId: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  
  // Trigger animation after component mounts
  React.useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateStep = () => {
    switch (activeStep) {
      case 0: // Basic info
        if (!formData.firstName || !formData.lastName || !formData.email) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!formData.email.includes('@') || !formData.email.includes('.')) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      case 1: // Password
        if (!formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      case 2: // User type specific
        if (formData.userType === USER_TYPES.CLIENT) {
          if (!formData.phone) {
            setError('Please provide a contact phone number');
            return false;
          }
        } else if (formData.userType === USER_TYPES.CAREGIVER) {
          if (!formData.phone || !formData.specializations) {
            setError('Please fill in all required fields');
            return false;
          }
        } else if (formData.userType === USER_TYPES.RESPONSIBLE) {
          if (!formData.phone) {
            setError('Please provide a contact phone number');
            return false;
          }
        }
        break;
      default:
        break;
    }
    
    setError('');
    return true;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before registration
      const { confirmPassword, ...registrationData } = formData;
      
      const result = register(registrationData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error(err);
    }
    
    setLoading(false);
  };
  
  const steps = [translations.basicInformation, translations.security, translations.userTypeDetails];
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label={translations.firstName}
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label={translations.lastName}
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={translations.emailAddress}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="user-type-label">{translations.userType}</InputLabel>
                  <Select
                    labelId="user-type-label"
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    label={translations.userType}
                  >
                    <MenuItem value={USER_TYPES.CLIENT}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1 }} />
                        {translations.clientUserType}
                      </Box>
                    </MenuItem>
                    <MenuItem value={USER_TYPES.CAREGIVER}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MedicalInformation sx={{ mr: 1 }} />
                        {translations.caregiverUserType}
                      </Box>
                    </MenuItem>
                    <MenuItem value={USER_TYPES.RESPONSIBLE}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SupervisorAccount sx={{ mr: 1 }} />
                        {translations.responsibleUserType}
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={translations.password}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label={translations.confirmPassword}
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label={translations.phoneNumber}
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              
              {formData.userType === USER_TYPES.CLIENT && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="birthDate"
                      label={translations.birthDate}
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="emergencyContact"
                      label={translations.emergencyContactName}
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="emergencyPhone"
                      label={translations.emergencyContactPhone}
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}
              
              {formData.userType === USER_TYPES.CAREGIVER && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="specializations"
                      label={translations.specializations}
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      placeholder={translations.specializationsPlaceholder}
                    />
                  </Grid>
                </>
              )}
              
              {formData.userType === USER_TYPES.RESPONSIBLE && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </>
        );
      default:
        return null;
    }
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
              flex: isMobile ? 'none' : '0 0 40%',
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
              {translations.personalAssistant}
            </Typography>
            
            <Button
              onClick={onLoginClick}
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              sx={{ 
                mt: 4, 
                borderColor: 'rgba(255,255,255,0.5)', 
                '&:hover': { 
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {translations.backToLogin}
            </Button>
          </Box>
          
          {/* Right side - Registration Form */}
          <CardContent 
            sx={{
              flex: isMobile ? 'none' : '0 0 60%',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxHeight: '80vh',
              overflowY: 'auto',
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
              {translations.createAccount}
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3 }}
            >
              {translations.joinSaveLife}
            </Typography>
            
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                width: '100%', 
                mb: 4,
                '& .MuiStepLabel-root .Mui-completed': {
                  color: theme.palette.primary.main
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: theme.palette.primary.dark
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                {error === 'Please fill in all required fields' ? translations.fillRequiredFields : error}
              </Alert>
            )}
            
            <Box component="form" sx={{ width: '100%', mt: 1 }}>
              {renderStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                    }
                  }}
                  startIcon={<ArrowBack />}
                >
                  {translations.back}
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        py: 1.2,
                        px: 3,
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
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      ) : (
                        <PersonAdd sx={{ mr: 1 }} />
                      )}
                      {loading ? translations.creatingAccount : translations.createAccountButton}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      sx={{
                        py: 1.2,
                        px: 3,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,105,217,0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 15px rgba(0,105,217,0.4)',
                        }
                      }}
                    >
                      {translations.next}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
    </Card>
  );
};

export default Register;
