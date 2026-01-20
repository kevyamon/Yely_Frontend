// src/components/ui/DriverRequestModal.jsx
import React from 'react';
import { Box, Typography, Button, Modal, Fade, Stack, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigationIcon from '@mui/icons-material/Navigation';

const DriverRequestModal = ({ open, request, onAccept, onDecline }) => {
  if (!request) return null;

  return (
    <Modal
      open={open}
      closeAfterTransition
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Fade in={open}>
        <Box sx={{ 
          width: '90%', maxWidth: 400, 
          bgcolor: 'rgba(20, 20, 20, 0.95)', 
          backdropFilter: 'blur(25px)', 
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '32px', 
          p: 3, 
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          outline: 'none',
          color: 'white'
        }}>
          
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ bgcolor: '#FFC107', color: 'black', fontWeight: 'bold', width: 56, height: 56 }}>
              {request.clientName ? request.clientName[0] : 'C'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="900">Nouvelle Course ! 🔥</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>{request.distance || '2.5 km'} • {request.category || 'Standard'}</Typography>
            </Box>
            <Box sx={{ ml: 'auto !important' }}>
              <Typography variant="h5" fontWeight="900" color="#FFC107">
                {request.price} F
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '20px', p: 2, mb: 4 }}>
            <Stack direction="row" spacing={2} mb={2}>
              <NavigationIcon sx={{ color: '#4CAF50', fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>DÉPART (5 min)</Typography>
                <Typography variant="body1" fontWeight="bold">{request.pickupAddress || 'Position actuelle'}</Typography>
              </Box>
            </Stack>
            
            <Box sx={{ width: 2, height: 20, bgcolor: 'rgba(255,255,255,0.1)', ml: 1.1, my: 0.5 }} />

            <Stack direction="row" spacing={2}>
              <LocationOnIcon sx={{ color: '#FFC107', fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>ARRIVÉE</Typography>
                <Typography variant="body1" fontWeight="bold">{request.dropoffAddress}</Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button 
              fullWidth variant="outlined" onClick={onDecline}
              sx={{ py: 2, borderRadius: '18px', borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            >
              REFUSER
            </Button>
            
            <motion.div whileTap={{ scale: 0.95 }} style={{ width: '100%' }}>
              <Button 
                fullWidth variant="contained" onClick={onAccept}
                sx={{ py: 2, borderRadius: '18px', bgcolor: '#FFC107', color: 'black', fontWeight: '900', fontSize: '1.1rem' }}
              >
                ACCEPTER
              </Button>
            </motion.div>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DriverRequestModal;