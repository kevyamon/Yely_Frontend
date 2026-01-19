// src/components/ui/VehicleCard.jsx
import React, { forwardRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const VehicleCard = forwardRef(({ vehicle, isSelected, onClick }, ref) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getBackground = () => {
    if (isSelected) {
      return isDark 
        ? 'linear-gradient(145deg, rgba(255, 193, 7, 0.15), rgba(0, 0, 0, 0.4))'
        : 'linear-gradient(145deg, #FFC107, #FFD54F)'; 
    }
    return isDark 
      ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))' 
      : 'rgba(255, 193, 7, 0.35)';
  };

  const getBorder = () => {
    if (isSelected) return '2px solid #FFC107'; 
    return isDark 
      ? '1px solid rgba(255, 255, 255, 0.2)' 
      : '1px solid rgba(255, 193, 7, 0.5)';
  };

  const getTextColor = (type) => {
    if (isSelected && !isDark) return 'black';
    if (isSelected && isDark) return 'white';
    if (type === 'title') return isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
    if (type === 'desc') return isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.7)';
    return 'inherit';
  };

  const getIconColor = () => {
    if (isSelected && !isDark) return 'black';
    return isSelected ? '#FFC107' : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)');
  };

  return (
    <motion.div
      ref={ref}
      layout
      onClick={onClick}
      animate={{ 
        y: isSelected ? -5 : 0, 
        scale: isSelected ? 1.02 : 0.95,
        opacity: 1 
      }}
      transition={{ duration: 0.3 }}
      style={{
        minWidth: '110px', // RÉDUIT (Était 130px)
        height: '140px',    // RÉDUIT (Était 160px) pour libérer de l'espace
        marginRight: '12px',
        borderRadius: '24px',
        cursor: 'pointer',
        background: getBackground(),
        backdropFilter: 'blur(15px)',
        border: getBorder(),
        boxShadow: isSelected 
          ? `0 10px 25px ${vehicle.glow}` 
          : '0 4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px', // RÉDUIT (Était 15px)
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isSelected && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{
            position: 'absolute', top: 0, width: '50%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)'
          }}
        />
      )}

      {/* ICÔNE : Taille réduite pour laisser la place au texte */}
      <Box 
        sx={{ 
          color: getIconColor(),
          mb: 1, // RÉDUIT (Était 2)
          transition: 'color 0.3s',
          '& svg': { fontSize: '24px !important' } // Force une taille plus petite
        }}
      >
        {vehicle.icon}
      </Box>

      {/* TITRE */}
      <Typography 
        variant="button" 
        fontWeight="900" 
        sx={{ 
          color: getTextColor('title'), 
          letterSpacing: 0.5,
          fontSize: '0.8rem', // RÉDUIT (Était 0.9rem)
          mb: 0.2 // RÉDUIT (Était 0.5)
        }}
      >
        {vehicle.title}
      </Typography>

      {/* SOUS-TITRE (Le fameux "Seul à bord") */}
      <Typography 
        variant="caption" 
        sx={{ 
          color: getTextColor('desc'), 
          fontSize: '0.65rem', // RÉDUIT (Était 0.7rem)
          lineHeight: 1.1,
          fontWeight: isSelected && !isDark ? 'bold' : 'normal',
          display: 'block'
        }}
      >
        {vehicle.shortDesc}
      </Typography>
    </motion.div>
  );
});

export default VehicleCard;