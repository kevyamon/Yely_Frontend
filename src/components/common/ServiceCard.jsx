// src/components/common/ServiceCard.jsx
import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Mapping des icônes (Tu pourras enrichir ça)
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import StarIcon from '@mui/icons-material/Star';

const ServiceCard = ({ 
  type, 
  price, 
  description, 
  isSelected, 
  onClick, 
  showPrice = true 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Sélection de l'icône selon le type
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'standard': return <DirectionsCarIcon sx={{ fontSize: 40, color: isSelected ? 'black' : '#FFC107' }} />;
      case 'moto': return <TwoWheelerIcon sx={{ fontSize: 40, color: isSelected ? 'black' : '#FFC107' }} />;
      case 'premium': return <StarIcon sx={{ fontSize: 40, color: isSelected ? 'black' : '#FFC107' }} />;
      default: return <DirectionsCarIcon sx={{ fontSize: 40, color: isSelected ? 'black' : '#FFC107' }} />;
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
    >
      <Paper
        onClick={onClick}
        elevation={isSelected ? 6 : 1}
        sx={{
          p: 2,
          minWidth: 120,
          cursor: 'pointer',
          borderRadius: '20px',
          border: isSelected ? '2px solid #FFC107' : '1px solid rgba(0,0,0,0.05)',
          bgcolor: isSelected ? '#FFC107' : (isDark ? '#1e1e1e' : 'white'),
          color: isSelected ? 'black' : 'text.primary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          height: '100%' // Pour l'uniformité dans une grille
        }}
      >
        <Box sx={{ mb: 1 }}>
          {getIcon()}
        </Box>
        
        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'capitalize' }}>
          {type}
        </Typography>
        
        {showPrice && price && (
          <Typography variant="body1" fontWeight="bold">
            {price} FCFA
          </Typography>
        )}

        {description && (
          <Typography variant="caption" align="center" sx={{ opacity: 0.7, mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
};

export default ServiceCard;