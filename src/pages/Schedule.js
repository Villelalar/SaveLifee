import React, { useState, useEffect, useCallback } from 'react';
import translations from '../utils/translations';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
  Tooltip,
  alpha
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Medication as MedicationIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import MedicationCheckIn from '../components/MedicationCheckIn';
import { useMedication } from '../context/MedicationContext';

// Helper function to format time
const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to get day name
const getDayName = (dayIndex) => {
  const days = [translations.sunday, translations.monday, translations.tuesday, translations.wednesday, translations.thursday, translations.friday, translations.saturday];
  return days[dayIndex];
};

const Schedule = () => {
  const { medications, checkMedicationTaken } = useMedication();
  const { theme, mode } = useTheme();
  const muiTheme = useMuiTheme();
  const [value, setValue] = useState(0);
  const [scheduleByDay, setScheduleByDay] = useState([]);
  const [scheduleByTime, setScheduleByTime] = useState([]);
  const [today] = useState(new Date().getDay());
  const [checkInDialog, setCheckInDialog] = useState({
    open: false,
    medication: null,
    scheduledTime: ''
  });

  useEffect(() => {
    // Create schedule by day (for the week)
    const byDay = Array(7).fill().map(() => []);
    
    // Create schedule by time (for today)
    const byTime = [];
    const now = new Date();
    const todayIndex = now.getDay();
    
    medications.forEach(med => {
      if (!med.schedule) return;
      
      // Handle both schedule formats
      let scheduleTimes = [];
      
      if (Array.isArray(med.schedule)) {
        // Old format: schedule is directly an array of times
        scheduleTimes = med.schedule;
      } else if (med.schedule.times && Array.isArray(med.schedule.times)) {
        // New format: schedule is an object with a times property
        scheduleTimes = med.schedule.times;
      } else {
        return; // Skip if no valid schedule format
      }
      
      // Process each scheduled time
      scheduleTimes.forEach(timeString => {
        // Add to every day
        for (let i = 0; i < 7; i++) {
          byDay[i].push({
            ...med,
            time: timeString,
            formattedTime: formatTime(timeString)
          });
        }
        
        // Add to today's schedule by time
        const [hours, minutes] = timeString.split(':').map(Number);
        const scheduleTime = new Date();
        scheduleTime.setHours(hours, minutes, 0, 0);
        
        byTime.push({
          ...med,
          time: timeString,
          formattedTime: formatTime(timeString),
          dateTime: scheduleTime,
          isPast: scheduleTime < now
        });
      });
    });
    
    // Sort each day's schedule by time
    byDay.forEach(day => {
      day.sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
    });
    
    // Sort today's schedule by time
    byTime.sort((a, b) => a.dateTime - b.dateTime);
    
    setScheduleByDay(byDay);
    setScheduleByTime(byTime);
    
    // Set initial tab to today
    setValue(todayIndex);
  }, [medications]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const openCheckInDialog = (medication, time) => {
    setCheckInDialog({
      open: true,
      medication,
      scheduledTime: time
    });
  };
  
  const closeCheckInDialog = () => {
    setCheckInDialog({
      open: false,
      medication: null,
      scheduledTime: ''
    });
  };
  
  // Check medication status (taken, skipped, or not taken)
  const getMedicationStatus = useCallback((medicationId, time) => {
    return checkMedicationTaken(medicationId, time);
  }, [checkMedicationTaken]);

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
        {translations.schedule}
      </Typography>
      
      {checkInDialog.open && checkInDialog.medication && (
        <MedicationCheckIn 
          medication={checkInDialog.medication}
          scheduledTime={checkInDialog.scheduledTime}
          open={checkInDialog.open}
          onClose={closeCheckInDialog}
        />
      )}
      
      {/* Today's Schedule Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {translations.dailySchedule}
          </Typography>
          
          {scheduleByTime.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              {translations.noScheduledDoses}
            </Typography>
          ) : (
            <List>
              {scheduleByTime.map((item, index) => (
                <ListItem 
                  key={`${item.id}-${item.time}`}
                  sx={{ 
                    mb: 1, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: () => {
                        const status = getMedicationStatus(item.id, item.time);
                        if (!status) return theme.palette.grey[400]; // Not taken yet
                        return status.taken ? theme.palette.success.main : theme.palette.warning.main;
                      }
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease',
                      boxShadow: 2
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.isPast ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <AccessTimeIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="span">
                          {item.formattedTime}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={item.name} 
                          color="primary" 
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    secondary={`${item.dosage} ${item.unit}${item.dosage > 1 ? 's' : ''}`}
                  />
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                    {(() => {
                      const status = getMedicationStatus(item.id, item.time);
                      if (status) {
                        return (
                          <Tooltip title={status.taken ? translations.taken : translations.skipped}>
                            <Chip 
                              label={status.taken ? translations.taken : translations.skipped} 
                              color={status.taken ? 'success' : 'warning'}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          </Tooltip>
                        );
                      }
                      return null;
                    })()}
                    
                    <Button
                      variant={mode === 'dark' ? 'outlined' : 'contained'}
                      color="primary"
                      size="small"
                      sx={{ 
                        borderRadius: 4,
                        mr: 1,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => openCheckInDialog(item, item.time)}
                    >
                      {translations.checkIn}
                    </Button>
                    
                    <IconButton
                      component={RouterLink}
                      to={`/medications/${item.id}`}
                      size="small"
                      color="primary"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
      
      {/* Weekly Schedule */}
      <Paper sx={{ 
        mb: 3, 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: mode === 'dark' ? `0 4px 20px 0 ${alpha(muiTheme.palette.primary.main, 0.15)}` : 3
      }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              fontWeight: 600,
              py: 2
            }
          }}
        >
          {Array(7).fill().map((_, index) => (
            <Tab 
              key={index} 
              label={getDayName(index)} 
              sx={{ 
                fontWeight: index === today ? 'bold' : 'normal',
              }}
            />
          ))}
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {scheduleByDay[value] && scheduleByDay[value].length > 0 ? (
            <List>
              {scheduleByDay[value].map((item, index) => (
                <React.Fragment key={`${item.id}-${item.time}`}>
                  {index > 0 && <Divider variant="inset" component="li" />}
                  <ListItem
                    sx={{ py: 1.5 }}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        size="small"
                        component={RouterLink}
                        to={`/medications/${item.id}`}
                        startIcon={<VisibilityIcon />}
                      >
                        {translations.details}
                      </Button>
                    }
                  >
                    <ListItemIcon>
                      {(() => {
                        const status = getMedicationStatus(item.id, item.time);
                        if (!status) {
                          return <MedicationIcon color="primary" />;
                        }
                        return status.taken ? 
                          <CheckCircleIcon color="success" /> : 
                          <CancelIcon color="warning" />;
                      })()}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={item.formattedTime}
                            color="primary"
                            variant="outlined"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      }
                      secondary={`${item.dosage} ${item.unit}${item.dosage > 1 ? 's' : ''}${item.instructions ? ` - ${item.instructions}` : ''}`}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                {translations.noScheduledDoses}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/medications/add"
              >
                {translations.addMedication}
                Add Medication
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Schedule;
