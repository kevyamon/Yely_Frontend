// src/components/ui/DriverInfoCard.jsx
import React from 'react';
import { Box, Typography, Button, Avatar, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch } from 'react-redux';
import { showToast } from '../../features/common/uiSlice';

const DriverInfoCard = ({ ride, onCancel }) => {
  const dispatch = useDispatch();

  if (!ride) return null;

  const driver = ride.driver || {};
  const vehicle = driver.vehicleInfo || {};

  // --- LOGIQUE TEXTE DYNAMIQUE ---
  let statusTitle = "Le chauffeur arrive";
  let statusSub = "Arrivée estimée : 5 min";
  let statusColor = "#FFC107"; // Jaune

  if (ride.status === 'ongoing') {
    statusTitle = "En route vers destination";
    statusSub = "Détendez-vous !";
    statusColor = "#4CAF50"; // Vert
  } else if (ride.status === 'completed') {
    statusTitle = "Vous êtes arrivé !";
    statusSub = "Merci d'avoir choisi Yély";
    statusColor = "#2196F3"; // Bleu
  }

  const handleCancelAttempt = () => {
    dispatch(showToast({ message: "Impossible d'annuler une course en cours !", type: 'error' }));
  };

  const handleCall = () => {
    if (driver.phone) window.open(`tel:${driver.phone}`);
    else dispatch(showToast({ message: "Numéro masqué", type: 'warning' }));
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Paper elevation={0} sx={{ p: 3, pb: 4, bgcolor: 'background.paper', borderRadius: '24px 24px 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' }}>
        
        {/* EN-TÊTE DYNAMIQUE */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6" fontWeight="900">{statusTitle}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
              {statusSub}
            </Typography>
          </Box>
          <Box sx={{ px: 1.5, py: 0.5, bgcolor: statusColor, borderRadius: '8px', fontWeight: 'bold', fontSize: '0.8rem', color: 'black' }}>
            {vehicle.plate || 'AB-123-CD'}
          </Box>
        </Box>

        {/* PROFIL */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar src={driver.profilePicture} sx={{ width: 60, height: 60, mr: 2, border: '3px solid #f5f5f5' }}>
            {driver.name ? driver.name[0] : '?'}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="subtitle1" fontWeight="bold">{driver.name || 'Chauffeur'}</Typography>
            <Typography variant="caption" color="text.secondary">{vehicle.color} {vehicle.model}</Typography>
            <Box display="flex" alignItems="center"><StarIcon sx={{ fontSize: 16, color: '#FFC107', mr: 0.5 }} /><Typography variant="caption" fontWeight="bold">4.9</Typography></Box>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton sx={{ bgcolor: 'action.hover' }}><MessageIcon /></IconButton>
            <IconButton onClick={handleCall} sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}><PhoneIcon /></IconButton>
          </Box>
        </Box>

        {/* BOUTON BLOQUÉ */}
        <Button fullWidth variant="text" color="error" onClick={handleCancelAttempt} sx={{ borderRadius: '12px', fontWeight: 'bold', opacity: 0.5 }}>
          Annuler la course
        </Button>
      </Paper>
    </motion.div>
  );
};

export default DriverInfoCard;