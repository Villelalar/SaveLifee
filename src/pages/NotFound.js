import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Box className="centered-content">
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
        <Typography variant="h1" color="primary" sx={{ fontSize: '5rem', fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Página Não Encontrada
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4 }}>
          A página que você está procurando não existe ou foi movida.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={RouterLink}
          to="/"
          startIcon={<HomeIcon />}
        >
          Voltar ao Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
