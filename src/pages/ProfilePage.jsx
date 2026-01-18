import React from 'react';
import { Box, Typography, Avatar, Paper, Button, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, pt: 8 }}>
      {/* BOUTON RETOUR */}
      <IconButton onClick={() => navigate('/home')} sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'background.paper' }}>
        <ArrowBackIcon />
      </IconButton>

      <Box textAlign="center" mb={4}>
        <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#FFC107', color: 'black', fontSize: '2.5rem', fontWeight: 'bold' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h5" fontWeight="900">{user?.name}</Typography>
        <Typography variant="body1" color="text.secondary">{user?.email}</Typography>
        <Typography variant="body1" color="text.secondary">{user?.phone}</Typography>
      </Box>

      {/* CARTE INFO CHAUFFEUR (Seulement si driver) */}
      {user?.role === 'driver' && (
        <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, border: '1px solid rgba(255, 193, 7, 0.3)', bgcolor: 'background.paper' }}>
          <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center">
            <BadgeIcon sx={{ mr: 1, color: '#FFC107' }} /> Identité Chauffeur
          </Typography>
          
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">ID Taxi</Typography>
            <Typography fontWeight="bold" sx={{ color: '#FFC107' }}>{user.driverId || 'En attente'}</Typography>
          </Box>
           <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Véhicule</Typography>
            <Typography fontWeight="bold">{user.vehicleInfo?.model || 'Non renseigné'}</Typography>
          </Box>
           <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Plaque</Typography>
            <Typography fontWeight="bold">{user.vehicleInfo?.plate || '---'}</Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
export default ProfilePage;