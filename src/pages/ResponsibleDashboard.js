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
  Chip,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  alpha,
  useMediaQuery
} from '@mui/material';
import { 
  SupervisorAccount as SupervisorIcon,
  Notifications as NotificationsIcon,
  ElderlyWoman as ElderlyIcon,
  Person as PersonIcon,
  MedicalInformation as MedicalIcon,
  Message as MessageIcon,
  Check as CheckIcon,
  Reply as ReplyIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const ResponsibleDashboard = () => {
  const { currentUser } = useAuth();
  const { theme, mode } = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  
  // Mock data for demonstration
  const careReceivers = [
    { 
      id: 1, 
      name: 'Maria Silva', 
      age: 78, 
      caregiver: 'Ana Oliveira',
      lastUpdate: '2 horas atrás',
      status: 'estável'
    },
    { 
      id: 2, 
      name: 'João Santos', 
      age: 82, 
      caregiver: 'Carlos Pereira',
      lastUpdate: '1 dia atrás',
      status: 'precisa de atenção'
    }
  ];
  
  const updates = [
    { 
      id: 1, 
      patient: 'Maria Silva', 
      caregiver: 'Ana Oliveira',
      date: '2025-06-07T10:30:00',
      message: 'Maria tomou todas as suas medicamentos da manhã como agendado. A pressão arterial foi 130/85, que está dentro do seu intervalo normal.',
      read: true
    },
    { 
      id: 2, 
      patient: 'João Santos', 
      caregiver: 'Carlos Pereira',
      date: '2025-06-07T09:15:00',
      message: 'João recusou-se a tomar sua medicamento de pressão arterial esta manhã. Vou tentar novamente à hora do almoço. Sua temperatura está normal.',
      read: false
    },
    { 
      id: 3, 
      patient: 'Maria Silva', 
      caregiver: 'Ana Oliveira',
      date: '2025-06-06T18:45:00',
      message: 'Maria teve um bom dia hoje. Ela comeu bem e tomou todas as suas medicamentos. Fizemos uma breve caminhada no jardim.',
      read: true
    }
  ];
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenUpdateDialog = (update) => {
    setSelectedUpdate(update);
    setOpenDialog(true);
    
    // Mark as read
    if (!update.read) {
      update.read = true;
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReplyMessage('');
  };
  
  const handleSendReply = () => {
    // In a real app, this would send the reply to the caregiver
    console.log(`Enviando resposta para atualização sobre ${selectedUpdate.patient}: ${replyMessage}`);
    handleCloseDialog();
    // You could show a success toast here
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'estável':
        return 'successo';
      case 'precisa de atenção':
        return 'alerta';
      case 'crítico':
        return 'erro';
      default:
        return 'padrao';
    }
  };
  
  const unreadUpdates = updates.filter(update => !update.read).length;
  
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
            bgcolor: theme.palette.info.main, 
            width: 48, 
            height: 48,
            mr: 2
          }}
        >
          <SupervisorIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            Bem-vindo, {currentUser?.firstName || 'Responsável'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Dashboard Responsável
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Receivers" icon={<ElderlyIcon />} iconPosition="start" />
          <Tab 
            label="Updates" 
            icon={
              <Badge badgeContent={unreadUpdates} color="error">
                <NotificationsIcon />
              </Badge>
            } 
            iconPosition="start" 
          />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {careReceivers.map((person) => (
            <Grid item xs={12} md={6} key={person.id}>
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
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2">
                        {person.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {person.age} years old
                      </Typography>
                    </Box>
                    <Chip 
                      label={person.status} 
                      color={getStatusColor(person.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <MedicalIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cuidador" 
                        secondary={person.caregiver}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <NotificationsIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Última atualização" 
                        secondary={person.lastUpdate}
                      />
                    </ListItem>
                  </List>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      component={Link}
                      to={`/care-receiver/${person.id}`}
                    >
                      Ver detalhes
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Updates List */}
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
                    <NotificationsIcon />
                  </Avatar>
                  <Typography variant="h6" component="h2">
                    Recentes atualizações
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {updates.map((update) => (
                    <React.Fragment key={update.id}>
                      <ListItem 
                        sx={{ 
                          px: 2, 
                          py: 1.5,
                          borderRadius: 2,
                          bgcolor: !update.read ? alpha(theme.palette.primary.light, 0.1) : 'transparent',
                          mb: 1
                        }}
                      >
                        <ListItemIcon>
                          <Badge 
                            color="error" 
                            variant="dot" 
                            invisible={update.read}
                          >
                            <Avatar 
                              sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: update.read ? theme.palette.grey[300] : theme.palette.primary.light
                              }}
                            >
                              <MessageIcon fontSize="small" />
                            </Avatar>
                          </Badge>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" component="span" sx={{ fontWeight: !update.read ? 600 : 400 }}>
                                {update.patient}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(update.date)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                From: {update.caregiver}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  fontWeight: !update.read ? 500 : 400
                                }}
                              >
                                {update.message}
                              </Typography>
                            </>
                          }
                        />
                        <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
                          {!update.read && (
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => {
                                update.read = true;
                                // Force re-render
                                setTabValue(tabValue);
                              }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          )}
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleOpenUpdateDialog(update)}
                            startIcon={<ReplyIcon />}
                          >
                            Responder
                          </Button>
                        </Box>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Reply Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Reply to Update
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.background.subtle, borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Original message from {selectedUpdate?.caregiver} about {selectedUpdate?.patient}:
            </Typography>
            <Typography variant="body2">
              {selectedUpdate?.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {selectedUpdate && formatDate(selectedUpdate.date)}
            </Typography>
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            id="reply"
            label="Your Reply"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained" 
            color="primary"
            disabled={!replyMessage.trim()}
            startIcon={<ReplyIcon />}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to create alpha colors
const createAlpha = (color, opacity) => {
  return color + opacity.toString(16).padStart(2, '0');
};

export default ResponsibleDashboard;
