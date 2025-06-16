import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  MedicalInformation as MedicalIcon,
  Notifications as NotificationsIcon,
  CalendarMonth as CalendarIcon,
  LocalPharmacy as PharmacyIcon,
  Person as PersonIcon,
  ElderlyWoman as ElderlyIcon,
  Add as AddIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import MedicationIcon from '@mui/icons-material/Medication';

const CaregiverDashboard = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateNote, setUpdateNote] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Mock data for demonstration
  const patients = [
    { id: 1, name: 'Maria Silva', age: 78, medications: 5, nextDose: '10:30 AM' },
    { id: 2, name: 'João Santos', age: 82, medications: 3, nextDose: '12:00 PM' }
  ];
  
  const upcomingMedications = [
    { id: 1, patient: 'Maria Silva', medication: 'Aspirin', time: '10:30 AM', dosage: '1 tablet' },
    { id: 2, patient: 'João Santos', medication: 'Insulin', time: '12:00 PM', dosage: '10 units' },
    { id: 3, patient: 'Maria Silva', medication: 'Vitamin D', time: '2:00 PM', dosage: '1 capsule' }
  ];
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenUpdateDialog = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUpdateNote('');
  };
  
  const handleSendUpdate = () => {
    console.log(`Enviando update sobre ${selectedPatient.name}: ${updateNote}`);
    handleCloseDialog();
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.secondary.main, 
            width: 56, 
            height: 56,
            mr: 2
          }}
        >
          <MedicalIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Bem-vindo, {currentUser?.firstName || 'Caregiver'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Dashboard do cuidador
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="caregiver dashboard tabs">
          <Tab label="Pacientes" icon={<ElderlyIcon />} iconPosition="start" />
          <Tab label="Agendamento de medicamentos" icon={<CalendarIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {patients.map((patient) => (
            <Grid item xs={12} md={6} key={patient.id}>
              <Card 
                elevation={1}
                sx={{ 
                  borderRadius: theme.shape.borderRadius,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      <ElderlyIcon />
                    </Avatar>
                    <Typography variant="h6" component="h2">
                      {patient.name}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Idade" 
                        secondary={patient.age}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Medicamentos ativos" 
                        secondary={patient.medications}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Próxima dose" 
                        secondary={patient.nextDose}
                      />
                    </ListItem>
                  </List>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      component={Link}
                      to={`/patient/${patient.id}`}
                    >
                      Ver detalhes
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      fullWidth
                      onClick={() => handleOpenUpdateDialog(patient)}
                      startIcon={<SendIcon />}
                    >
                      Enviar atualização
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {/* Add New Patient Card */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={1}
              sx={{ 
                height: '100%',
                borderRadius: theme.shape.borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px dashed ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.subtle,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.light,
                    width: 60,
                    height: 60,
                    margin: '0 auto',
                    mb: 2
                  }}
                >
                  <AddIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                  Adicionar novo paciente
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Adicionar um novo paciente a sua lista de cuidados
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  component={Link}
                  to="/add-patient"
                >
                  Adicionar paciente
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Today's Medication Schedule */}
          <Grid item xs={12}>
            <Card 
              elevation={1}
              sx={{ 
                borderRadius: theme.shape.borderRadius
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <CalendarIcon />
                  </Avatar>
                  <Typography variant="h6" component="h2">
                    Agendamento de medicamentos
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {upcomingMedications.map((med) => (
                    <ListItem key={med.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <PharmacyIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${med.patient} - ${med.medication}`} 
                        secondary={`${med.time} - ${med.dosage}`}
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ ml: 2 }}
                      >
                        Marcar como administrado
                      </Button>
                    </ListItem>
                  ))}
                </List>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  sx={{ mt: 2 }}
                  component={Link}
                  to="/schedule"
                >
                  Ver agendamento completo 
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card 
              elevation={1}
              sx={{ 
                borderRadius: theme.shape.borderRadius,
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Atalhos
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Button
                      component={Link}
                      to="/add-medication"
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<MedicationIcon />}
                      sx={{ py: 1.5 }}
                    >
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
                      startIcon={<CalendarIcon />}
                      sx={{ py: 1.5 }}
                    >
                      Agendamento
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      component={Link}
                      to="/medications"
                      variant="contained"
                      color="info"
                      fullWidth
                      startIcon={<PharmacyIcon />}
                      sx={{ py: 1.5 }}
                    >
                      Medicações
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      component={Link}
                      to="/profile"
                      variant="contained"
                      color="success"
                      fullWidth
                      startIcon={<PersonIcon />}
                      sx={{ py: 1.5 }}
                    >
                      Perfil
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Send Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Update about {selectedPatient?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Esse update será enviado para a pessoa responsável por esse paciente.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="update"
            label="Update Note"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={updateNote}
            onChange={(e) => setUpdateNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSendUpdate} 
            variant="contained" 
            color="primary"
            disabled={!updateNote.trim()}
            startIcon={<SendIcon />}
          >
            Enviar atualização
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaregiverDashboard;
