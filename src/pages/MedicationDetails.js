import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Alert
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Medication as MedicationIcon,
  Notes as NotesIcon,
  Warning as WarningIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useMedication } from '../context/MedicationContext';

// Placeholder image for medications
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300?text=Medication';

const MedicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { medications, deleteMedication } = useMedication();
  
  const [medication, setMedication] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (medications && medications.length > 0) {
      const med = medications.find(m => m.id === id);
      if (med) {
        setMedication(med);
      } else {
        setNotFound(true);
      }
    }
  }, [id, medications]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMedication(id);
    setDeleteDialogOpen(false);
    navigate('/medications');
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Calculate days remaining for a medication
  const calculateDaysRemaining = () => {
    if (!medication || !medication.quantity || !medication.dosage) {
      return null;
    }
    
    let dailyDoses = 1; // Default to 1 dose per day
    
    if (medication.schedule) {
      if (medication.schedule.times && Array.isArray(medication.schedule.times)) {
        // New format with schedule object
        dailyDoses = medication.schedule.times.length;
      } else if (Array.isArray(medication.schedule)) {
        // Old format with direct array of times
        dailyDoses = medication.schedule.length;
      }
    }
    
    return Math.floor(medication.quantity / (medication.dosage * dailyDoses));
  };

  if (notFound) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          Medicamento não encontrado. O medicamento pode ter sido excluído.
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/medications')}
          startIcon={<ArrowBackIcon />}
        >
          Voltar para Medicamentos
        </Button>
      </Box>
    );
  }

  if (!medication) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const daysRemaining = calculateDaysRemaining();
  const isLowStock = daysRemaining !== null && daysRemaining < 7;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/medications')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1" className="page-title">
          {medication.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="250"
              image={medication.image || PLACEHOLDER_IMAGE}
              alt={medication.name}
              sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="div">
                  {medication.name}
                </Typography>
                {isLowStock && (
                  <Chip
                    icon={<WarningIcon />}
                    label={`${daysRemaining} days left`}
                    color={daysRemaining < 3 ? "error" : "warning"}
                  />
                )}
              </Box>

              {medication.category && (
                <Chip 
                  icon={<CategoryIcon />}
                  label={medication.category} 
                  color="primary"
                  sx={{ mb: 2 }}
                />
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  to={`/medications/edit/${medication.id}`}
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                  fullWidth
                  sx={{ ml: 1 }}
                >
                  Excluir
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Dosage Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <MedicationIcon sx={{ mr: 1 }} color="primary" />
                  Informações de Dosagem
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Dosagem
                    </Typography>
                    <Typography variant="body1">
                      {medication.dosage} {medication.unit}{medication.dosage > 1 ? 's' : ''}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Quantidade Atual
                    </Typography>
                    <Typography variant="body1">
                      {medication.quantity !== null && medication.quantity !== undefined 
                        ? `${medication.quantity} ${medication.unit}${medication.quantity !== 1 ? 's' : ''}`
                        : 'Not specified'}
                    </Typography>
                  </Grid>

                  {daysRemaining !== null && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Dias Restantes
                      </Typography>
                      <Typography 
                        variant="body1"
                        color={isLowStock ? (daysRemaining < 3 ? 'error' : 'warning.main') : 'inherit'}
                      >
                        {daysRemaining} dias
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Schedule */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ mr: 1 }} color="primary" />
                  Calendário
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {(() => {
                  let scheduleTimes = [];
                  
                  if (medication.schedule) {
                    if (medication.schedule.times && Array.isArray(medication.schedule.times)) {
                      // New format with schedule object
                      scheduleTimes = medication.schedule.times;
                    } else if (Array.isArray(medication.schedule)) {
                      // Old format with direct array of times
                      scheduleTimes = medication.schedule;
                    }
                  }
                  
                  return scheduleTimes.length > 0 ? (
                    <List dense>
                      {scheduleTimes.map((time) => (
                        <ListItem key={time}>
                          <ListItemIcon>
                            <AccessTimeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={time} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Nenhum horário programado especificado.
                    </Typography>
                  );
                })()}
              </Paper>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <InfoIcon sx={{ mr: 1 }} color="primary" />
                  Informações Adicionais
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {medication.description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center">
                        <NotesIcon fontSize="small" sx={{ mr: 1 }} />
                        Descrição
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {medication.description}
                      </Typography>
                    </Grid>
                  )}

                  {medication.instructions && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center">
                        <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                        Special Instructions
                      </Typography>
                      <Typography variant="body1">
                        {medication.instructions}
                      </Typography>
                    </Grid>
                  )}

                  {!medication.description && !medication.instructions && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        No additional information provided.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Medication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {medication.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationDetails;
