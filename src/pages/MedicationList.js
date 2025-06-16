import React, { useState, useEffect } from 'react';
import translations from '../utils/translations';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import MedicationCheckIn from '../components/MedicationCheckIn';
import { useMedication } from '../context/MedicationContext';

// Placeholder image for medications
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150?text=Medication';

const MedicationList = () => {
  const { medications, deleteMedication, loading, checkMedicationTaken } = useMedication();
  const { theme, mode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState(null);
  const [checkInDialog, setCheckInDialog] = useState({
    open: false,
    medication: null,
    scheduledTime: ''
  });

  useEffect(() => {
    if (medications) {
      setFilteredMedications(
        medications.filter(med => 
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (med.description && med.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [medications, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (medication) => {
    setMedicationToDelete(medication);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (medicationToDelete) {
      deleteMedication(medicationToDelete.id);
      setDeleteDialogOpen(false);
      setMedicationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMedicationToDelete(null);
  };

  const openCheckInDialog = (medication) => {
    // Get current time in HH:MM format for the check-in
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    setCheckInDialog({
      open: true,
      medication,
      scheduledTime: currentTime
    });
  };

  const closeCheckInDialog = () => {
    setCheckInDialog({
      open: false,
      medication: null,
      scheduledTime: ''
    });
  };

  // Check if a medication has been taken today
  const getMedicationStatus = (medicationId) => {
    // Get current date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For each scheduled time 
    const medication = medications.find(med => med.id === medicationId);
    
    if (!medication || !medication.schedule) {
      return { taken: false, skipped: false };
    }
    
    let taken = false;
    let skipped = false;
    let scheduleTimes = [];
    
    // Handle both schedule formats
    if (Array.isArray(medication.schedule)) {
      // Old format: schedule is directly an array of times
      scheduleTimes = medication.schedule;
    } else if (medication.schedule.times && Array.isArray(medication.schedule.times)) {
      // New format: schedule is an object with a times property
      scheduleTimes = medication.schedule.times;
    }
    
    // If no valid schedule format or empty schedule
    if (scheduleTimes.length === 0) {
      return { taken: false, skipped: false };
    }
    
    scheduleTimes.forEach(time => {
      const status = checkMedicationTaken(medicationId, time);
      if (status) {
        if (status.taken) taken = true;
        else skipped = true;
      }
    });
    
    return { taken, skipped };
  };

  // Calculate days remaining for a medication
  const calculateDaysRemaining = (medication) => {
    if (!medication.quantity || !medication.dosage || !medication.schedule || !medication.schedule.length) {
      return null;
    }
    
    const dailyDoses = medication.schedule.length;
    return Math.floor(medication.quantity / (medication.dosage * dailyDoses));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
        {translations.medications}
      </Typography>
      
      {checkInDialog.open && checkInDialog.medication && (
        <MedicationCheckIn 
          medication={checkInDialog.medication}
          scheduledTime={checkInDialog.scheduledTime}
          open={checkInDialog.open}
          onClose={closeCheckInDialog}
        />
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder={translations.searchMedications}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/medications/add"
        >
          Adicionar Medicamento
        </Button>
      </Box>



      {filteredMedications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          {translations.noMedicationsFound}. {translations.addYourFirst}.
        </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {medications.length === 0 
              ? "Você ainda não adicionou nenhum medicamento." 
              : "Nenhum medicamento corresponde à sua busca."}
          </Typography>
          {medications.length === 0 && (
            <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/add-medication"
            sx={{ 
              ml: { xs: 0, sm: 2 },
              mt: { xs: 2, sm: 0 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {translations.addNewMedication}
          </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMedications.map((medication) => {
            const daysRemaining = calculateDaysRemaining(medication);
            const isLowStock = daysRemaining !== null && daysRemaining < 7;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={medication.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: mode === 'dark' ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}` : 6
                  },
                  position: 'relative'
                }}>
                  {(() => {
                    const status = getMedicationStatus(medication.id);
                    if (status.taken || status.skipped) {
                      return (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            zIndex: 2,
                            bgcolor: status.taken ? 'success.main' : 'warning.main',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 2
                          }}
                        >
                          {status.taken ? <CheckCircleIcon /> : <AccessTimeIcon />}
                        </Box>
                      );
                    }
                    return null;
                  })()}
                  <CardMedia
                    component="img"
                    height="140"
                    image={medication.image || PLACEHOLDER_IMAGE}
                    alt={medication.name}
                    sx={{
                      objectFit: 'cover',
                      filter: mode === 'dark' ? 'brightness(0.8)' : 'none'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {medication.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {medication.dosage} {medication.unit}, {medication.frequency}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {translations.stock}: {medication.quantity} {medication.unit}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {medication.quantity && (
                      <Chip 
                        label={`${medication.quantity} ${medication.unit} left`} 
                        size="small" 
                        color={isLowStock ? "warning" : "default"}
                      />
                    )}
                    {medication.category && (
                      <Chip 
                        label={medication.category} 
                        size="small" 
                        color="primary"
                      />
                    )}
                  </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={translations.medicationDetails}>
                        <IconButton 
                          component={RouterLink} 
                          to={`/medication/${medication.id}`}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={translations.edit}>
                        <IconButton 
                          component={RouterLink} 
                          to={`/medications/edit/${medication.id}`}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={translations.checkIn}>
                        <IconButton 
                          color="success"
                          onClick={() => openCheckInDialog(medication)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={translations.delete}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(medication)}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: alpha('#f44336', 0.1),
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{translations.confirm}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {translations.confirmDelete} {medicationToDelete?.name}? {translations.cannotBeUndone}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            {translations.cancel}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {translations.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationList;
