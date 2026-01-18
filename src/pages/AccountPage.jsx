import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, pt: 8 }}>
      <IconButton onClick={() => navigate('/home')} sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'background.paper' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" fontWeight="900" mb={4}>Mon Compte</Typography>
      <Button variant="outlined" fullWidth sx={{ mb: 2 }}>Changer mot de passe</Button>
      <Button variant="outlined" color="error" fullWidth>Supprimer mon compte</Button>
    </Box>
  );
};
export default AccountPage;