// src/components/ui/RideSummaryModal.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Rating, Avatar, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const RideSummaryModal = ({ ride, userRole, onClose, isVisible }) => {
  const [rating, setRating] = useState(5);

  // Si pas visible ou pas de données, on n'affiche rien
  if (!isVisible || !ride) return null;

  return (
    <AnimatePresence>
      <Box
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, 
          backdropFilter: 'blur(10px)', // Effet de flou moderne
          bgcolor: 'rgba(0,0,0,0.6)', // Fond sombre semi-transparent
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <Box
            sx={{
              width: '85vw', maxWidth: 350,
              bgcolor: 'white', borderRadius: '30px', p: 4,
              textAlign: 'center', 
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              color: 'text.primary' // Force texte noir
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
            
            <Typography variant="h5" fontWeight="900" gutterBottom>
              Course Terminée !
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {userRole === 'driver' ? 'Paiement encaissé avec succès.' : 'Merci d\'avoir voyagé avec Yély.'}
            </Typography>

            {/* PRIX */}
            <Box sx={{ bgcolor: '#F5F5F5', py: 2, borderRadius: '20px', mb: 3 }}>
              <Typography variant="h3" fontWeight="900" color="primary">
                {ride.price} <span style={{ fontSize: '1rem', color: '#666' }}>FCFA</span>
              </Typography>
            </Box>

            {/* INFO INTERLOCUTEUR */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={4}>
              <Avatar 
                src={userRole === 'driver' ? ride.client?.profilePicture : ride.driver?.profilePicture} 
                sx={{ width: 50, height: 50, border: '2px solid #eee' }} 
              >
                 {(userRole === 'driver' ? ride.client?.name : ride.driver?.name)?.charAt(0)}
              </Avatar>
              <Box textAlign="left">
                <Typography variant="subtitle2" fontWeight="bold">
                  {userRole === 'driver' ? ride.client?.name : ride.driver?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userRole === 'driver' ? 'Passager' : 'Chauffeur Yély'}
                </Typography>
              </Box>
            </Stack>

            {/* NOTATION (Seulement pour le Passager) */}
            {userRole === 'user' && (
              <Box mb={4}>
                <Typography component="legend" fontWeight="bold" mb={1} fontSize="0.9rem">Notez votre expérience</Typography>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                />
              </Box>
            )}

            <Button 
              fullWidth variant="contained" color="primary" onClick={onClose}
              sx={{ py: 1.5, borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)' }}
            >
              {userRole === 'user' ? 'ENVOYER & FERMER' : 'RETOUR ACCUEIL'}
            </Button>

          </Box>
        </motion.div>
      </Box>
    </AnimatePresence>
  );
};

export default RideSummaryModal;