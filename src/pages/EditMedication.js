import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  InputAdornment,
  Paper,
  Alert
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMedication } from '../context/MedicationContext';

const EditMedication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { medications, updateMedication } = useMedication();
  
  const [medication, setMedication] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('pill');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [instructions, setInstructions] = useState('');
  const [scheduleTime, setScheduleTime] = useState(null);
  const [schedule, setSchedule] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  const unitOptions = [
    'pilula', 'tableta', 'capsula', 'ml', 'mg', 'g', 'gota', 'spray', 'patch', 'injeção'
  ];

  const categoryOptions = [
    'Medicação para dor', 'Antibiotico', 'Antidepressante', 'Anti-inflamatorio', 
    'Antialérgico', 'Pressão arterial', 'colesterol', 'Diabetes', 
    'Medicação cardíaca', 'Suplemento', 'Vitamina', 'Outro'
  ];

  // Load medication data
  useEffect(() => {
    if (medications && medications.length > 0) {
      const med = medications.find(m => m.id === id);
      
      if (med) {
        setMedication(med);
        setName(med.name || '');
        setDescription(med.description || '');
        setDosage(med.dosage || '');
        setUnit(med.unit || 'pilula');
        setQuantity(med.quantity || '');
        setCategory(med.category || '');
        setInstructions(med.instructions || '');
        // Handle schedule properly
        if (med.schedule && med.schedule.times) {
          setSchedule(med.schedule.times);
        } else if (Array.isArray(med.schedule)) {
          // Handle old format where schedule was an array of times
          setSchedule(med.schedule);
        } else {
          setSchedule([]);
        }
      } else {
        setNotFound(true);
      }
    }
  }, [id, medications]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!dosage) newErrors.dosage = 'Dosagem é obrigatória';
    if (!unit) newErrors.unit = 'Unidade é obrigatória';
    if (quantity && isNaN(Number(quantity))) newErrors.quantity = 'Quantidade deve ser um número';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSchedule = () => {
    if (!scheduleTime) return;
    
    const hours = scheduleTime.getHours().toString().padStart(2, '0');
    const minutes = scheduleTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    if (!schedule.includes(timeString)) {
      setSchedule([...schedule, timeString].sort());
    }
    
    setScheduleTime(null);
  };

  const handleRemoveSchedule = (timeToRemove) => {
    setSchedule(schedule.filter(time => time !== timeToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const updatedMedication = {
      ...medication,
      name,
      description,
      dosage: Number(dosage),
      unit,
      quantity: quantity ? Number(quantity) : null,
      category: category || null,
      instructions,
      schedule: {
        type: 'daily',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        times: schedule
      }
    };
    
    updateMedication(updatedMedication);
    navigate('/medications');
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
        >
          Voltar para Medicamentos
        </Button>
      </Box>
    );
  }

  if (!medication) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom className="page-title">
        Editar Medicamento
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Medication Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Categoria</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Categoria"
                >
                  <MenuItem value="">
                    <em>Nenhuma</em>
                  </MenuItem>
                  {categoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            
            {/* Dosage Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações de Dosagem
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosagem"
                type="number"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                InputProps={{
                  inputProps: { min: 0, step: 0.5 }
                }}
                error={!!errors.dosage}
                helperText={errors.dosage}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="unit-label">Unidade</InputLabel>
                <Select
                  labelId="unit-label"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  label="Unidade"
                  error={!!errors.unit}
                >
                  {unitOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.unit && <FormHelperText error>{errors.unit}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">{unit}s</InputAdornment>
                }}
                error={!!errors.quantity}
                helperText={errors.quantity || "Quantidade restante"}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instruções Especiais"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                multiline
                rows={2}
                placeholder="Tomar com comida, etc"
              />
            </Grid>
            
            {/* Schedule */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Calendário
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TimePicker
                label="Adicionar Hora"
                value={scheduleTime}
                onChange={(newValue) => setScheduleTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSchedule}
                startIcon={<AddIcon />}
                disabled={!scheduleTime}
                sx={{ height: '56px' }}
                fullWidth
              >
                Adicionar Hora
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {schedule.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    Nenhuma hora programada adicionada ainda.
                  </Typography>
                ) : (
                  schedule.map((time) => (
                    <Chip
                      key={time}
                      label={time}
                      onDelete={() => handleRemoveSchedule(time)}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                )}
              </Box>
            </Grid>
            
            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/medications/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                > 
                  Salvar Alterações
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditMedication;
