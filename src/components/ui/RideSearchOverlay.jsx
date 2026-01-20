// src/components/ui/RideSearchOverlay.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RadarIcon from '@mui/icons-material/Radar';

const RideSearchOverlay = ({ isVisible, onCancel }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(10, 10, 10, 0.85)', // Fond sombre élégant
            backdropFilter: 'blur(15px)', // Flou iOS
            zIndex: 9999, // Toujours au-dessus
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center'
          }}
        >
          {/* CERCLE PULSANT */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: '50%', border: '2px solid #FFC107'
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <RadarIcon sx={{ fontSize: 80, color: '#FFC107', zIndex: 2, position: 'relative' }} />
            </motion.div>
          </Box>
          
          <Typography variant="h5" fontWeight="900" gutterBottom sx={{ letterSpacing: 0.5 }}>
            Recherche de Taxi...
          </Typography>
          
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 5, maxWidth: '250px' }}>
            Nous contactons les chauffeurs les plus proches de votre position.
          </Typography>
          
          <Button 
            variant="outlined" 
            onClick={onCancel}
            sx={{ 
              borderRadius: '30px', 
              px: 4, py: 1.2,
              borderColor: 'rgba(255,255,255,0.3)', 
              color: 'white', 
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Annuler la recherche
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RideSearchOverlay;