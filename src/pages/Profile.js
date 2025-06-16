import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Avatar,
  TextField,
  Divider,
  Paper,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  SupervisorAccount as SupervisorIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { currentUser, userType, USER_TYPES } = useAuth();
  const { theme } = useTheme();
  
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    password: '',
    confirmPassword: '',
    address: currentUser?.address || '',
    emergencyContact: currentUser?.emergencyContact || '',
    emergencyPhone: currentUser?.emergencyPhone || '',
    specializations: currentUser?.specializations || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // In a real app, this would update the user profile in the database
    // For now, we'll just simulate success
    setTimeout(() => {
      setSuccess('Perfil atualizado com sucesso');
      setEditing(false);
    }, 1000);
  };
  
  const getUserIcon = () => {
    switch (userType) {
      case USER_TYPES.CAREGIVER:
        return <MedicalIcon fontSize="large" />;
      case USER_TYPES.RESPONSIBLE:
        return <SupervisorIcon fontSize="large" />;
      default:
        return <PersonIcon fontSize="large" />;
    }
  };
  
  const getUserTypeLabel = () => {
    switch (userType) {
      case USER_TYPES.CLIENT:
        return 'Cliente';
      case USER_TYPES.CAREGIVER:
        return 'Cuidador';
      case USER_TYPES.RESPONSIBLE:
        return 'Pessoa Responsável';
      default:
        return 'Usuário';
    }
  };
  
  const getUserColor = () => {
    switch (userType) {
      case USER_TYPES.CLIENT:
        return theme.palette.primary.main;
      case USER_TYPES.CAREGIVER:
        return theme.palette.secondary.main;
      case USER_TYPES.RESPONSIBLE:
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: theme.shape.borderRadius,
          background: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: getUserColor(), 
              width: 64, 
              height: 64,
              mr: 2
            }}
          >
            {getUserIcon()}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {currentUser?.firstName} {currentUser?.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {getUserTypeLabel()}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant={editing ? "outlined" : "contained"}
            color={editing ? "secondary" : "primary"}
            startIcon={editing ? <SaveIcon /> : <EditIcon />}
            onClick={() => editing ? handleSubmit() : setEditing(true)}
          >
            {editing ? 'Salvar Alterações' : 'Editar Perfil'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sobrenome"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
            
            {editing && (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      Change Password (optional)
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Senha"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar Senha"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Divider>
                <Typography variant="body2" color="text.secondary">
                  Additional Information
                </Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
                multiline
                rows={2}
              />
            </Grid>
            
            {userType === USER_TYPES.CLIENT && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome do Contato de Emergência"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone de Emergência"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
              </>
            )}
            
            {userType === USER_TYPES.CAREGIVER && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Especializações"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleChange}
                  disabled={!editing}
                  multiline
                  rows={2}
                />
              </Grid>
            )}
          </Grid>
          
          {editing && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                color="error" 
                sx={{ mr: 2 }}
                onClick={() => {
                  setEditing(false);
                  setError('');
                  setSuccess('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                type="submit"
                startIcon={<SaveIcon />}
              >
                Salvar Alterações
              </Button>
            </Box>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;
