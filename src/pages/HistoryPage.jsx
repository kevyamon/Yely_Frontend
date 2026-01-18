import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, pt: 8 }}>
      <IconButton onClick={() => navigate('/home')} sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'background.paper' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" fontWeight="900" mb={4}>Mes Courses</Typography>
      <Typography color="text.secondary" align="center">Aucune course effectuée pour le moment.</Typography>
    </Box>
  );
};
export default HistoryPage;