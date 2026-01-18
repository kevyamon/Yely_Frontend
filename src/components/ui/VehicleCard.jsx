// src/components/ui/VehicleCard.jsx
import React, { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const VehicleCard = forwardRef(({ vehicle, isSelected, onClick }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      onClick={onClick}
      // Animation : Quand sélectionné, la carte monte un peu et brille
      animate={{ 
        y: isSelected ? -10 : 0, 
        scale: isSelected ? 1.05 : 0.95,
        opacity: isSelected ? 1 : 0.7 
      }}
      transition={{ duration: 0.3 }}
      style={{
        // DIMENSIONS "MOBILE FIRST" (Beaucoup plus petit !)
        minWidth: '130px', 
        height: '160px',
        marginRight: '15px',
        borderRadius: '24px',
        cursor: 'pointer',
        
        // STYLE "VERRE SOMBRE"
        background: isSelected 
          ? 'linear-gradient(145deg, rgba(255, 193, 7, 0.15), rgba(0, 0, 0, 0.4))' // Doré subtil si actif
          : 'rgba(255, 255, 255, 0.03)', // Très sombre sinon
        
        backdropFilter: 'blur(15px)',
        
        // BORDURE
        border: isSelected 
          ? '1px solid rgba(255, 193, 7, 0.6)' // Bordure Jaune Yély
          : '1px solid rgba(255, 255, 255, 0.08)', // Bordure discrète
        
        // OMBRE (Glow)
        boxShadow: isSelected 
          ? `0 10px 25px ${vehicle.glow}` 
          : 'none',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* EFFET DE LUMIÈRE QUI PASSE (Reflet) */}
      {isSelected && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{
            position: 'absolute', top: 0, width: '50%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            transform: 'skewX(-20deg)'
          }}
        />
      )}

      {/* L'ICÔNE (La Star ici) */}
      <Box 
        sx={{ 
          color: isSelected ? '#FFC107' : 'rgba(255,255,255,0.5)',
          mb: 2,
          transition: 'color 0.3s'
        }}
      >
        {vehicle.icon}
      </Box>

      {/* TITRE */}
      <Typography 
        variant="button" 
        fontWeight="900" 
        sx={{ 
          color: isSelected ? 'white' : 'rgba(255,255,255,0.6)', 
          letterSpacing: 1,
          fontSize: '0.9rem',
          mb: 0.5
        }}
      >
        {vehicle.title}
      </Typography>

      {/* SOUS-TITRE (Prix ou Info) */}
      <Typography 
        variant="caption" 
        sx={{ 
          color: isSelected ? '#FFC107' : 'rgba(255,255,255,0.4)', 
          fontSize: '0.7rem',
          lineHeight: 1.2
        }}
      >
        {vehicle.shortDesc}
      </Typography>

    </motion.div>
  );
});

export default VehicleCard;