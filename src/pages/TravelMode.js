import React, { useState } from 'react';
import translations from '../utils/translations';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Divider, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  TextField, 
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  FlightTakeoff as FlightIcon,
  CalendarMonth as CalendarIcon,
  Medication as MedicationIcon,
  Luggage as LuggageIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { format, differenceInDays, addDays } from 'date-fns';
import { useMedication } from '../context/MedicationContext';
import { useTheme } from '../context/ThemeContext';

const TravelMode = () => {
  const { medications } = useMedication();
  const { theme, mode } = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 7));
  const [buffer, setBuffer] = useState(2); // Extra days as buffer
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [calculationDone, setCalculationDone] = useState(false);
  const [travelPlan, setTravelPlan] = useState([]);

  // Handle medication selection
  const handleMedicationToggle = (medicationId) => {
    setSelectedMedications(prev => {
      if (prev.includes(medicationId)) {
        return prev.filter(id => id !== medicationId);
      } else {
        return [...prev, medicationId];
      }
    });
    setCalculationDone(false);
  };

  // Handle selecting all medications
  const handleSelectAll = () => {
    if (selectedMedications.length === medications.length) {
      setSelectedMedications([]);
    } else {
      setSelectedMedications(medications.map(med => med.id));
    }
    setCalculationDone(false);
  };

  // Calculate pills needed for travel
  const calculateTravelPlan = () => {
    const tripDays = differenceInDays(endDate, startDate) + 1;
    const totalDays = tripDays + buffer;
    
    const plan = selectedMedications.map(medId => {
      const medication = medications.find(m => m.id === medId);
      if (!medication) return null;
      
      // Calculate doses per day
      let dosesPerDay = 0;
      if (medication.schedule && medication.schedule.length > 0) {
        dosesPerDay = medication.schedule.length;
      } else if (medication.frequency === 'daily') {
        dosesPerDay = 1;
      } else if (medication.frequency === 'twice daily') {
        dosesPerDay = 2;
      } else if (medication.frequency === 'three times daily') {
        dosesPerDay = 3;
      } else if (medication.frequency === 'four times daily') {
        dosesPerDay = 4;
      }
      
      // Calculate total pills needed
      const pillsPerDose = medication.dosage || 1;
      const totalPills = dosesPerDay * totalDays * pillsPerDose;
      
      // Check if enough stock is available
      const hasEnoughStock = medication.quantity >= totalPills;
      
      return {
        id: medication.id,
        name: medication.name,
        dosage: medication.dosage,
        unit: medication.unit,
        dosesPerDay,
        pillsPerDose,
        totalPills,
        hasEnoughStock,
        currentStock: medication.quantity || 0
      };
    }).filter(Boolean);
    
    setTravelPlan(plan);
    setCalculationDone(true);
  };

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'MMM dd, yyyy');
  };

  // Print the travel plan
  const handlePrint = () => {
    window.print();
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
        <FlightIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
        {translations.travelMode}
      </Typography>

      <Grid container spacing={3}>
        {/* Travel Details Section */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={mode === 'dark' ? 0 : 3}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
              boxShadow: mode === 'dark' ? `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.15)}` : 3,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} />
              {translations.tripDetails}
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={translations.startDate}
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    setCalculationDone(false);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={translations.endDate}
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                    setCalculationDone(false);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={startDate}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="buffer-days-label">{translations.bufferDays}</InputLabel>
                  <Select
                    labelId="buffer-days-label"
                    id="buffer-days"
                    value={buffer}
                    label={translations.bufferDays}
                    onChange={(e) => {
                      setBuffer(e.target.value);
                      setCalculationDone(false);
                    }}
                  >
                    <MenuItem value={0}>{translations.noBuffer}</MenuItem>
                    <MenuItem value={1}>+1 {translations.day}</MenuItem>
                    <MenuItem value={2}>+2 {translations.days}</MenuItem>
                    <MenuItem value={3}>+3 {translations.days}</MenuItem>
                    <MenuItem value={5}>+5 {translations.days}</MenuItem>
                    <MenuItem value={7}>+1 {translations.week}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                {translations.tripSummary}:
              </Typography>
              <Box sx={{ pl: 2, borderLeft: `3px solid ${theme.palette.primary.main}`, py: 1 }}>
                <Typography variant="body1">
                  {translations.from}: {formatDate(startDate)}
                </Typography>
                <Typography variant="body1">
                  {translations.to}: {formatDate(endDate)}
                </Typography>
                <Typography variant="body1">
                  {translations.duration}: {differenceInDays(endDate, startDate) + 1} {translations.days}
                </Typography>
                <Typography variant="body1">
                  {translations.totalDaysToPack}: {differenceInDays(endDate, startDate) + 1 + buffer} {translations.days}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Medication Selection Section */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={mode === 'dark' ? 0 : 3}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
              boxShadow: mode === 'dark' ? `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.15)}` : 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicationIcon sx={{ mr: 1 }} />
                {translations.selectMedications}
              </Typography>
              <Button 
                size="small" 
                onClick={handleSelectAll}
                variant="outlined"
                startIcon={selectedMedications.length === medications.length ? <CheckCircleIcon /> : <AddIcon />}
              >
                {selectedMedications.length === medications.length ? translations.deselectAll : translations.selectAll}
              </Button>
            </Box>
            
            {medications.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                {translations.noMedicationsAvailable}
              </Typography>
            ) : (
              <List sx={{ 
                overflow: 'auto', 
                flexGrow: 1,
                maxHeight: '300px',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha(theme.palette.divider, 0.1),
                }
              }}>
                {medications.map((med) => (
                  <ListItem 
                    key={med.id}
                    button 
                    onClick={() => handleMedicationToggle(med.id)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: selectedMedications.includes(med.id) 
                        ? theme.palette.primary.main 
                        : theme.palette.divider,
                      bgcolor: selectedMedications.includes(med.id) 
                        ? alpha(theme.palette.primary.main, mode === 'dark' ? 0.2 : 0.1)
                        : 'transparent',
                      '&:hover': {
                        bgcolor: selectedMedications.includes(med.id)
                          ? alpha(theme.palette.primary.main, mode === 'dark' ? 0.3 : 0.15)
                          : alpha(theme.palette.action.hover, 0.1),
                      }
                    }}
                  >
                    <ListItemIcon>
                      {selectedMedications.includes(med.id) ? (
                        <CheckCircleIcon color="primary" />
                      ) : (
                        <MedicationIcon color="action" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={med.name} 
                      secondary={`${med.dosage} ${med.unit} | ${translations.stock}: ${med.quantity || 0}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={calculateTravelPlan}
                disabled={selectedMedications.length === 0}
                startIcon={<LuggageIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: mode === 'dark' ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}` : 4,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: mode === 'dark' ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}` : 6,
                  }
                }}
              >
                {translations.calculatePillsNeeded}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Results Section */}
        {calculationDone && (
          <Grid item xs={12}>
            <Paper 
              elevation={mode === 'dark' ? 0 : 3}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
                boxShadow: mode === 'dark' ? `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.15)}` : 3,
              }}
              className="print-section"
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <LuggageIcon sx={{ mr: 1 }} />
                  {translations.travelMedicationPlan}
                </Typography>
                <Box>
                  <Tooltip title={translations.printPlan}>
                    <IconButton onClick={handlePrint} color="primary">
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={translations.sharePlan}>
                    <IconButton color="primary">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  {translations.tripDetails}:
                </Typography>
                <Typography variant="body1">
                  {translations.from} {formatDate(startDate)} {translations.to} {formatDate(endDate)} ({differenceInDays(endDate, startDate) + 1} {translations.days})
                </Typography>
                <Typography variant="body1">
                  {translations.bufferDays}: {buffer} {buffer === 1 ? translations.day : translations.days} = {translations.totalDaysToPack}: {differenceInDays(endDate, startDate) + 1 + buffer} {translations.days}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                {travelPlan.map((med) => (
                  <Grid item xs={12} sm={6} md={4} key={med.id}>
                    <Card sx={{ 
                      borderRadius: 2, 
                      border: '1px solid',
                      borderColor: med.hasEnoughStock ? theme.palette.success.main : theme.palette.error.main,
                      boxShadow: mode === 'dark' ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}` : 2,
                    }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {med.name}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {translations.dosage}: {med.dosage} {med.unit} × {med.dosesPerDay} {translations.times} {translations.daily}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {translations.stock}: {med.currentStock} {med.unit}
                        </Typography>
                        <Box sx={{ 
                          mt: 2, 
                          p: 1.5, 
                          bgcolor: med.hasEnoughStock 
                            ? alpha(theme.palette.success.main, mode === 'dark' ? 0.15 : 0.1)
                            : alpha(theme.palette.error.main, mode === 'dark' ? 0.15 : 0.1),
                          borderRadius: 1,
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" sx={{ 
                            fontWeight: 700, 
                            color: med.hasEnoughStock 
                              ? theme.palette.success.main 
                              : theme.palette.error.main 
                          }}>
                            {med.totalPills} {med.unit}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: med.hasEnoughStock 
                              ? theme.palette.success.main 
                              : theme.palette.error.main,
                            fontWeight: 500
                          }}>
                            {med.hasEnoughStock 
                              ? translations.sufficientStock 
                              : `${translations.needMore} ${med.totalPills - med.currentStock} ${med.unit}`}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Print-only section */}
              <Box sx={{ mt: 4, display: 'none' }} className="print-only">
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" align="center">
                  {translations.generatedBy} {format(new Date(), 'dd/MM/yyyy')}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TravelMode;
