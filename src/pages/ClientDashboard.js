import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  alpha,
  useMediaQuery,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Medication as MedicationIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  LocalPharmacy as PharmacyIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMedication } from '../context/MedicationContext';
import translations from '../utils/translations';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const { theme, mode } = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { medications, loading } = useMedication();
  
  const [upcomingMedications, setUpcomingMedications] = useState([]);
  const [lowStockMedications, setLowStockMedications] = useState([]);
  
  // Function to get today's schedule
  useEffect(() => {
    if (medications && medications.length > 0) {
      // Process medications to get today's schedule
      const today = new Date();
      const dayOfWeek = today.getDay();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = dayNames[dayOfWeek];
      
      // Get medications scheduled for today
      const todayMeds = medications.filter(med => {
        // Check if medication has schedule for today
        if (!med.schedule) return false;
        
        // Handle old format (direct array of times)
        if (Array.isArray(med.schedule)) {
          return true; // Old format is always considered daily
        }
        
        // Check if medication is scheduled for specific days
        if (med.schedule.type === 'specific-days') {
          return med.schedule.days.includes(todayName);
        }
        
        // For daily medications
        return med.schedule.type === 'daily';
      });
      
      // Format the upcoming medications
      const upcoming = todayMeds.flatMap(med => {
        if (!med.schedule) return [];
        
        // Handle old format (direct array of times)
        if (Array.isArray(med.schedule)) {
          return med.schedule.map(time => ({
            id: med.id,
            name: med.name,
            time: time,
            dosage: `${med.dosage} ${med.unit}`
          }));
        }
        
        // Handle new format (object with times property)
        if (med.schedule.times && Array.isArray(med.schedule.times)) {
          return med.schedule.times.map(time => ({
            id: med.id,
            name: med.name,
            time: time,
            dosage: `${med.dosage} ${med.unit}`
          }));
        }
        
        return [];
      });
      
      // Sort by time
      upcoming.sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
      
      setUpcomingMedications(upcoming);
      
      // Get medications with low stock (less than 5)
      const lowStock = medications.filter(med => med.quantity && med.quantity < 5)
        .map(med => ({
          id: med.id,
          name: med.name,
          remaining: med.quantity
        }));
      
      setLowStockMedications(lowStock);
    }
  }, [medications]);
  
  return (
    <Box sx={{ 
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center',
        flexWrap: 'wrap',
        pb: 2
      }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main, 
            width: 48, 
            height: 48,
            mr: 2
          }}
        >
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            Bem-vindo(a), {currentUser?.firstName || 'User'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
           Dashboard do cliente 
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Today's Medications */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={mode === 'dark' ? 2 : 1}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : '#fff',
              border: `1px solid ${mode === 'dark' ? 'transparent' : alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ 
              p: 2, 
              bgcolor: mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : theme.palette.primary.main,
              color: '#fff',
              display: 'flex',
              alignItems: 'center'
            }}>
              <MedicationIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                Medicamentos do dia
              </Typography>
            </Box>
            
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{translations.upcomingDoses}</Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : upcomingMedications.length > 0 ? (
                <List>
                  {upcomingMedications.map((med) => (
                    <ListItem key={`${med.id}-${med.time}`} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <MedicationIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={med.name}
                        secondary={`${med.time} - ${med.dosage}`}
                      />
                      <Chip 
                        label={translations.taken} 
                        color="primary" 
                        size="small" 
                        sx={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary">{translations.noScheduledDoses}</Typography>
                </Box>
              )}
              <Button 
                component={Link}
                to="/schedule"
                variant="text" 
                color="primary" 
                fullWidth
                sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}
              >
                Ver o agendamento
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Medication Alerts */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={mode === 'dark' ? 2 : 1}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: mode === 'dark' ? alpha(theme.palette.error.main, 0.05) : '#fff',
              border: `1px solid ${mode === 'dark' ? 'transparent' : alpha(theme.palette.error.main, 0.1)}`,
            }}
          >
            <Box sx={{ 
              p: 2, 
              bgcolor: mode === 'dark' ? alpha(theme.palette.error.main, 0.2) : theme.palette.error.main,
              color: '#fff',
              display: 'flex',
              alignItems: 'center'
            }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                Alertas de medicamentos
              </Typography>
            </Box>
            
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{translations.stockAlerts}</Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : lowStockMedications.length > 0 ? (
                <List>
                  {lowStockMedications.map((med) => (
                    <ListItem key={med.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                          <WarningIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={med.name}
                        secondary={`${translations.only} ${med.remaining} ${translations.left}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary">{translations.noAlerts}</Typography>
                </Box>
              )}
              <Button 
                component={Link}
                to="/medications"
                variant="text" 
                color="error" 
                fullWidth
                sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}
              >
                Gerenciar medicamentos
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper 
            elevation={mode === 'dark' ? 2 : 1}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#fff',
              mt: 2
            }}
          >
            <Box sx={{ 
              p: 2, 
              bgcolor: mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.light, 0.1),
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
            }}>
              <Typography variant="h6" component="h2">
                Ações rápidas
              </Typography>
            </Box>
            
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Button
                    component={Link}
                    to="/add-medication"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={!isMobile && <AddIcon />}
                    sx={{ 
                      py: 1.5,
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      height: { xs: '100%', sm: 'auto' },
                      minHeight: { xs: '80px', sm: 'auto' }
                    }}
                  >
                    {isMobile && <AddIcon sx={{ mb: 0.5 }} />}
                    Adicionar medicamento
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    component={Link}
                    to="/schedule"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={!isMobile && <CalendarIcon />}
                    sx={{ 
                      py: 1.5,
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      height: { xs: '100%', sm: 'auto' },
                      minHeight: { xs: '80px', sm: 'auto' }
                    }}
                  >
                    {isMobile && <CalendarIcon sx={{ mb: 0.5 }} />}
                    Ver o agendamento
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    component={Link}
                    to="/medications"
                    variant="contained"
                    color="info"
                    fullWidth
                    startIcon={!isMobile && <PharmacyIcon />}
                    sx={{ 
                      py: 1.5,
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      height: { xs: '100%', sm: 'auto' },
                      minHeight: { xs: '80px', sm: 'auto' }
                    }}
                  >
                    {isMobile && <PharmacyIcon sx={{ mb: 0.5 }} />}
                    Minhas Medicamentos
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    component={Link}
                    to="/profile"
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={!isMobile && <PersonIcon />}
                    sx={{ 
                      py: 1.5,
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      height: { xs: '100%', sm: 'auto' },
                      minHeight: { xs: '80px', sm: 'auto' }
                    }}
                  >
                    {isMobile && <PersonIcon sx={{ mb: 0.5 }} />}
                    Minha conta
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDashboard;
