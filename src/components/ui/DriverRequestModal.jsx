// src/components/ui/DriverRequestModal.jsx
import React from 'react';
import { Dialog, Box, Typography, Button, Slide, Avatar, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigationIcon from '@mui/icons-material/Navigation';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DriverRequestModal = ({ open, request, onAccept, onDecline }) => {
  if (!request) return null;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="xs"
      PaperProps={{
        style: {
          borderRadius: 24,
          backgroundColor: '#1a1a1a',
          color: 'white',
          margin: 16,
          position: 'absolute',
          bottom: 0,
          width: 'calc(100% - 32px)'
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        
        {/* EN-TÊTE : TYPE & PRIX */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold">Nouvelle Course !</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
              <LocalFireDepartmentIcon sx={{ color: '#FF5722', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {request.distance || '2.5 km'} • {request.category || 'Standard'}
              </Typography>
            </Stack>
          </Box>
          
          {/* 🟢 CORRECTION PRIX : Taille ajustée et couleur jaune flash */}
          <Typography variant="h4" fontWeight="900" sx={{ color: '#FFC107', lineHeight: 1 }}>
            {request.price} F
          </Typography>
        </Box>

        {/* CLIENT */}
        <Box display="flex" alignItems="center" mb={3} sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 1.5, borderRadius: 3 }}>
          <Avatar sx={{ bgcolor: '#FFC107', color: 'black', mr: 2, fontWeight: 'bold' }}>
            {request.client?.name ? request.client.name[0] : 'C'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
                {request.client?.name || 'Client Yély'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {request.client?.rating || '4.9'} ⭐
            </Typography>
          </Box>
        </Box>

        {/* ITINÉRAIRE */}
        <Box sx={{ position: 'relative', pl: 2, mb: 4 }}>
          {/* Ligne verticale */}
          <Box sx={{ 
            position: 'absolute', left: 7, top: 8, bottom: 20, 
            width: 2, bgcolor: 'rgba(255,255,255,0.2)' 
          }} />

          {/* DÉPART */}
          <Box mb={3} position="relative">
            <NavigationIcon sx={{ position: 'absolute', left: -22, top: 0, fontSize: 16, color: '#4CAF50' }} />
            <Typography variant="caption" color="success.main" fontWeight="bold">DÉPART (5 min)</Typography>
            <Typography variant="body1" fontWeight="bold" noWrap>
              {request.pickupLocation?.address || "Position actuelle"}
            </Typography>
          </Box>

          {/* ARRIVÉE */}
          <Box position="relative">
            <LocationOnIcon sx={{ position: 'absolute', left: -22, top: 0, fontSize: 16, color: '#FFC107' }} />
            <Typography variant="caption" color="primary" fontWeight="bold">ARRIVÉE</Typography>
            <Typography variant="body1" fontWeight="bold" noWrap>
              {request.dropoffLocation?.address || "Destination"}
            </Typography>
          </Box>
        </Box>

        {/* BOUTONS D'ACTION */}
        <Stack direction="row" spacing={2}>
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            onClick={onDecline}
            sx={{ borderRadius: 4, py: 1.5, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            REFUSER
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={onAccept}
            sx={{ 
              borderRadius: 4, py: 1.5, 
              bgcolor: '#FFC107', color: 'black', fontWeight: '900', fontSize: '1rem',
              '&:hover': { bgcolor: '#FFD54F' }
            }}
          >
            ACCEPTER
          </Button>
        </Stack>

      </Box>
    </Dialog>
  );
};

export default DriverRequestModal;