import React, { useState, useEffect, useMemo } from 'react';
import translations from '../utils/translations';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  CircularProgress,
  useTheme as useMuiTheme,
  Paper,
  alpha,
  useMediaQuery,
  Alert,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Medication as MedicationIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useMedication } from '../context/MedicationContext';

const Dashboard = () => {
  const { medications, loading } = useMedication();
  const { theme, mode } = useTheme();
  const muiTheme = useMuiTheme();
  const [upcomingDoses, setUpcomingDoses] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    // Calculate upcoming doses (medications due in the next 24 hours)
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const upcoming = medications
      .filter(med => {
        if (!med.schedule || !med.schedule.length) return false;
        
        // Check if any scheduled time is within the next 24 hours
        return med.schedule.some(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduleDate = new Date();
          scheduleDate.setHours(hours, minutes, 0, 0);
          
          // If the time has already passed today, check for tomorrow
          if (scheduleDate < now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
          }
          
          return scheduleDate <= next24Hours;
        });
      })
      .map(med => {
        // Find the next upcoming dose
        let nextDose = null;
        let nextDoseTime = null;
        
        med.schedule.forEach(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduleDate = new Date();
          scheduleDate.setHours(hours, minutes, 0, 0);
          
          // If the time has already passed today, check for tomorrow
          if (scheduleDate < now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
          }
          
          if (!nextDoseTime || scheduleDate < nextDoseTime) {
            nextDose = time;
            nextDoseTime = scheduleDate;
          }
        });
        
        return {
          ...med,
          nextDose,
          nextDoseTime
        };
      })
      .sort((a, b) => a.nextDoseTime - b.nextDoseTime);
    
    setUpcomingDoses(upcoming);
    
    // Calculate medications with low stock (less than 7 days remaining)
    const lowStockMeds = medications.filter(med => {
      if (!med.quantity || !med.dosage || !med.schedule) return false;
      
      const dailyDoses = med.schedule.length;
      const daysRemaining = med.quantity / (med.dosage * dailyDoses);
      
      return daysRemaining < 7;
    });
    
    setLowStock(lowStockMeds);
  }, [medications]);

  const StatCard = ({ title, value, icon, color }) => {
    const cardBgColor = mode === 'light' 
      ? muiTheme.palette[color].light 
      : alpha(muiTheme.palette[color].main, 0.2);
    
    const cardTextColor = mode === 'light'
      ? muiTheme.palette[color].dark
      : muiTheme.palette[color].light;
      
    return (
      <Card 
        sx={{ 
          height: '100%', 
          bgcolor: cardBgColor,
          color: cardTextColor,
          boxShadow: mode === 'dark' ? `0 4px 20px 0 ${alpha(muiTheme.palette[color].main, 0.25)}` : 3,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: mode === 'dark' 
              ? `0 8px 25px 0 ${alpha(muiTheme.palette[color].main, 0.4)}` 
              : 6,
          }
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Box mr={2} sx={{ color: muiTheme.palette[color].main }}>
              {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h3" component="div" align="center" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 700, 
        mb: 3,
        color: mode === 'dark' ? 'primary.light' : 'text.primary',
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        pb: 1,
        display: 'inline-block'
      }}>
        {translations.dashboard}
      </Typography>
      
      {medications.length === 0 && !loading ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          {translations.welcomeToSaveLife}
        </Alert>
      ) : null}
      
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <StatCard 
            title={translations.totalMedications} 
            value={medications.length} 
            icon={<MedicationIcon />} 
            color="primary" 
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard 
            title={translations.upcomingDoses} 
            value={upcomingDoses.length} 
            icon={<NotificationsIcon />} 
            color="primary" 
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard 
            title={translations.lowStock} 
            value={lowStock.length} 
            icon={<WarningIcon />} 
            color="error" 
          />
        </Grid>
        
        {/* Upcoming Doses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2, 
            height: '100%',
            borderRadius: 2,
            boxShadow: mode === 'dark' ? `0 4px 20px 0 ${alpha(muiTheme.palette.primary.main, 0.15)}` : 3,
            bgcolor: mode === 'dark' ? alpha(muiTheme.palette.primary.main, 0.05) : 'background.paper',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: mode === 'dark' ? `0 8px 25px 0 ${alpha(muiTheme.palette.primary.main, 0.25)}` : 4,
            }
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: mode === 'dark' ? 'warning.light' : 'warning.main',
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1 }
            }}>
              <NotificationsIcon fontSize="small" /> {translations.upcomingDoses}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {upcomingDoses.length > 0 ? (
              <List>
                {upcomingDoses.slice(0, 5).map((med) => (
                  <ListItem 
                    key={med.id} 
                    button 
                    component={RouterLink} 
                    to={`/medications/${med.id}`}
                    sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemIcon>
                      <MedicationIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={med.name} 
                      secondary={`${med.dosage} ${med.unit} at ${med.nextDose}`} 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {translations.noUpcomingDoses}
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Low Stock Alerts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2, 
            height: '100%',
            borderRadius: 2,
            boxShadow: mode === 'dark' ? `0 4px 20px 0 ${alpha(muiTheme.palette.primary.main, 0.15)}` : 3,
            bgcolor: mode === 'dark' ? alpha(muiTheme.palette.primary.main, 0.05) : 'background.paper',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: mode === 'dark' ? `0 8px 25px 0 ${alpha(muiTheme.palette.primary.main, 0.25)}` : 4,
            }
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: mode === 'dark' ? 'warning.light' : 'warning.main',
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1 }
            }}>
              <WarningIcon fontSize="small" /> {translations.lowStock}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {lowStock.length > 0 ? (
              <List>
                {lowStock.map((med) => {
                  const dailyDoses = med.schedule.length;
                  const daysRemaining = Math.floor(med.quantity / (med.dosage * dailyDoses));
                  
                  return (
                    <ListItem 
                      key={med.id} 
                      button 
                      component={RouterLink} 
                      to={`/medications/${med.id}`}
                      sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <ListItemIcon>
                        {daysRemaining < 3 ? (
                          <WarningIcon color="error" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={med.name} 
                        secondary={`${daysRemaining} days remaining`} 
                      />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                {translations.allMedicationsHaveSufficientStock}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
