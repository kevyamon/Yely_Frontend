// src/components/ui/VehicleCard.jsx
import React, { forwardRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const VehicleCard = forwardRef(({ vehicle, isSelected, onClick }, ref) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // --- LOGIQUE DES COULEURS (BOOST VISIBILITÉ 🚀) ---
  const getBackground = () => {
    if (isSelected) {
      // SÉLECTIONNÉ (On ne change rien car tu adores)
      return isDark 
        ? 'linear-gradient(145deg, rgba(255, 193, 7, 0.15), rgba(0, 0, 0, 0.4))'
        : 'linear-gradient(145deg, #FFC107, #FFD54F)'; 
    }
    
    // NON SÉLECTIONNÉ (C'est ici qu'on augmente la visibilité)
    // Nuit : On passe de 0.03 à 0.12 (4x plus visible !) + un léger dégradé
    // Jour : On passe de 0.15 à 0.35 (Jaune beaucoup plus franc)
    return isDark 
      ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))' 
      : 'rgba(255, 193, 7, 0.35)';
  };

  const getBorder = () => {
    if (isSelected) return '2px solid #FFC107'; 
    
    // NON SÉLECTIONNÉ (Bordures plus marquées)
    // Nuit : Blanc à 20% (avant 8%)
    // Jour : Jaune foncé à 50% (avant 30%)
    return isDark 
      ? '1px solid rgba(255, 255, 255, 0.2)' 
      : '1px solid rgba(255, 193, 7, 0.5)';
  };

  const getTextColor = (type) => {
    // Gestion du texte sélectionné
    if (isSelected && !isDark) return 'black';
    if (isSelected && isDark) return 'white';
    
    // NON SÉLECTIONNÉ (Textes plus opaques pour être lisibles)
    if (type === 'title') return isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'; // Presque opaque
    if (type === 'desc') return isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.7)';
    return 'inherit';
  };

  const getIconColor = () => {
    if (isSelected && !isDark) return 'black';
    // NON SÉLECTIONNÉ : On rend l'icône plus visible aussi
    return isSelected ? '#FFC107' : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)');
  };

  return (
    <motion.div
      ref={ref}
      layout
      onClick={onClick}
      animate={{ 
        y: isSelected ? -10 : 0, 
        scale: isSelected ? 1.05 : 0.95,
        opacity: 1 // Toujours 100% opaque maintenant
      }}
      transition={{ duration: 0.3 }}
      style={{
        minWidth: '130px', 
        height: '160px',
        marginRight: '15px',
        borderRadius: '24px',
        cursor: 'pointer',
        
        background: getBackground(),
        backdropFilter: 'blur(15px)',
        border: getBorder(),
        
        // On ajoute une petite ombre même aux non-sélectionnés pour les décoller du fond
        boxShadow: isSelected 
          ? `0 10px 25px ${vehicle.glow}` 
          : '0 4px 10px rgba(0,0,0,0.1)',

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
      {/* REFLET SÉLECTIONNÉ */}
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

      {/* ICÔNE */}
      <Box 
        sx={{ 
          color: getIconColor(),
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
          color: getTextColor('title'), 
          letterSpacing: 1,
          fontSize: '0.9rem',
          mb: 0.5
        }}
      >
        {vehicle.title}
      </Typography>

      {/* SOUS-TITRE */}
      <Typography 
        variant="caption" 
        sx={{ 
          color: getTextColor('desc'), 
          fontSize: '0.7rem',
          lineHeight: 1.2,
          fontWeight: isSelected && !isDark ? 'bold' : 'normal'
        }}
      >
        {vehicle.shortDesc}
      </Typography>

    </motion.div>
  );
});

export default VehicleCard;