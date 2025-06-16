import React, { useState } from 'react';
import translations from '../utils/translations';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useMedication } from '../context/MedicationContext';
import { useTheme } from '../context/ThemeContext';
import { showMedicationTaken, showMedicationSkipped } from '../services/NotificationService';

const MedicationCheckIn = ({ medication, scheduledTime, onClose, open }) => {
  const { recordConsumption, updateConsumption, checkMedicationTaken } = useMedication();
  const { theme, mode } = useTheme();
  
  // Check if this medication was already taken at this time
  const consumptionStatus = checkMedicationTaken(medication.id, scheduledTime);
  const [status, setStatus] = useState(consumptionStatus ? 
    (consumptionStatus.taken ? 'taken' : 'skipped') : null);
  
  const handleTaken = () => {
    if (consumptionStatus && consumptionStatus.recordId) {
      updateConsumption(consumptionStatus.recordId, true);
    } else {
      recordConsumption(medication.id, new Date().toISOString(), true);
    }
    setStatus('taken');
    showMedicationTaken(medication);
    setTimeout(() => onClose(), 1000);
  };
  
  const handleSkipped = () => {
    if (consumptionStatus && consumptionStatus.recordId) {
      updateConsumption(consumptionStatus.recordId, false);
    } else {
      recordConsumption(medication.id, new Date().toISOString(), false);
    }
    setStatus('skipped');
    showMedicationSkipped(medication);
    setTimeout(() => onClose(), 1000);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: mode === 'dark' ? `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.3)}` : 8,
          bgcolor: mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : theme.palette.background.paper,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        pb: 1
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {translations.medicationCheckIn}
        </Typography>
        <Button onClick={onClose} color="primary" sx={{ mt: 2 }}>{translations.close}</Button>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            {medication.name}
          </Typography>
          
          <Chip 
            icon={<AccessTimeIcon />} 
            label={scheduledTime} 
            color="primary" 
            variant="outlined" 
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {medication.dosage} {medication.unit}
          </Typography>
          
          {medication.instructions && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              "{medication.instructions}"
            </Typography>
          )}
        </Box>
        
        {status && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2
          }}>
            <Chip
              icon={status === 'taken' ? <CheckCircleIcon /> : <CancelIcon />}
              label={status === 'taken' ? translations.taken : translations.skipped}
              color={status === 'taken' ? 'success' : 'warning'}
              sx={{ fontWeight: 500 }}
            />
          </Box>
        )}
        
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <Tooltip title={translations.taken}>
            <Chip 
              label={translations.taken} 
              color="success" 
              icon={<CheckCircleIcon />}
              variant={status === 'taken' ? 'filled' : 'outlined'}
              onClick={handleTaken}
              sx={{ 
                fontSize: '1rem', 
                py: 2.5, 
                px: 1,
                '& .MuiChip-label': { px: 2 },
                '& .MuiChip-icon': { fontSize: '1.2rem' },
                ...(status === 'taken' ? {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`
                } : {})
              }}
            />
          </Tooltip>
          
          <Tooltip title={translations.skipped}>
            <Chip 
              label={translations.skipped} 
              color="warning" 
              icon={<CancelIcon />}
              variant={status === 'skipped' ? 'filled' : 'outlined'}
              onClick={handleSkipped}
              sx={{ 
                fontSize: '1rem', 
                py: 2.5, 
                px: 1,
                '& .MuiChip-label': { px: 2 },
                '& .MuiChip-icon': { fontSize: '1.2rem' },
                ...(status === 'skipped' ? {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.4)}`
                } : {})
              }}
            />
          </Tooltip>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationCheckIn;
