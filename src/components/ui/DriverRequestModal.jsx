// src/components/ui/DriverRequestModal.jsx
import React from 'react';
import { Box, Typography, Button, Avatar, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const DriverRequestModal = ({ ride, isVisible, onAccept, onDecline }) => {
  if (!isVisible || !ride) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          sx={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, backdropFilter: 'blur(8px)', bgcolor: 'rgba(0,0,0,0.4)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Box
              sx={{
                width: '90vw', maxWidth: 400,
                bgcolor: 'white', // Fond blanc pur pour contraste max
                borderRadius: '30px', p: 3,
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)', textAlign: 'center',
                color: 'text.primary' // Force l'écriture en noir/gris
              }}
            >
              <Typography variant="overline" fontWeight="900" color="primary" sx={{ letterSpacing: 2 }}>
                NOUVELLE COURSE YÉLY
              </Typography>

              {/* CLIENT */}
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 2, mb: 3 }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#FFC107', color: 'black', fontWeight: 'bold' }}>
                    {ride.client?.name?.charAt(0) || "C"}
                </Avatar>
                <Box textAlign="left">
                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }}>
                        {ride.client?.name || "Client"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        ⭐ {ride.client?.rating || "5.0"} • {ride.paymentMethod === 'cash' ? 'Espèces' : 'Wave'}
                    </Typography>
                </Box>
              </Stack>

              {/* TRAJET */}
              <Box sx={{ bgcolor: '#F5F5F5', borderRadius: '20px', p: 2, mb: 3 }}>
                <Stack direction="row" alignItems="center" mb={1.5}>
                    <LocationOnIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="bold" sx={{ color: 'black' }} noWrap>
                        {ride.pickupLocation?.address || "Position client"}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mt={2}>
                    <Box display="flex" alignItems="center" sx={{ bgcolor: 'white', px: 1.5, py: 0.5, borderRadius: 10 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                        <Typography variant="caption" fontWeight="bold" color="text.primary">~5 min</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ bgcolor: 'white', px: 1.5, py: 0.5, borderRadius: 10 }}>
                        <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'green' }} />
                        <Typography variant="caption" fontWeight="bold" color="success.main">
                            {ride.price} FCFA
                        </Typography>
                    </Box>
                </Stack>
              </Box>

              {/* ACTIONS */}
              <Stack direction="row" spacing={2}>
                <Button fullWidth variant="outlined" color="error" onClick={onDecline} sx={{ borderRadius: '15px', py: 1.5, fontWeight: 'bold', border: '2px solid' }}>
                    REFUSER
                </Button>
                <Button fullWidth variant="contained" color="success" onClick={onAccept} sx={{ borderRadius: '15px', py: 1.5, fontWeight: 'bold', boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)' }}>
                    ACCEPTER
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default DriverRequestModal;