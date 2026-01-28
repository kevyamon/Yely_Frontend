// src/components/ui/GlassCard.jsx
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  hoverEffect = false, 
  blobColor = null, // Si tu mets une couleur (ex: "#FFC107"), le blob liquide apparaît !
  onClick,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Le style de base du verre
  const glassStyle = {
    position: 'relative',
    overflow: 'hidden', // Important pour couper le blob qui dépasse
    borderRadius: '30px',
    cursor: onClick ? 'pointer' : 'default',
    
    // L'EFFET LIQUID GLASS
    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(40px)', // Le flou puissant
    
    // BORDURES DE LUMIÈRE (Plus claires en haut/gauche)
    borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.8)',
    borderLeft: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.8)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    
    // OMBRE PROFONDE
    boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.1)',
    
    ...sx // Permet de surcharger le style si besoin
  };

  const Content = (
    <Box sx={glassStyle} onClick={onClick} {...props}>
      {/* LE BLOB LIQUIDE AUTOMATIQUE (Si blobColor est fourni) */}
      {blobColor && (
        <Box
          component={motion.div}
          animate={{ 
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: blobColor,
            filter: 'blur(80px)', // Flou extrême pour l'effet diffus
            opacity: 0.2,
            zIndex: 0,
            pointerEvents: 'none' // Pour pouvoir cliquer à travers
          }}
        />
      )}
      
      {/* Le contenu réel (texte, boutons...) est mis au-dessus du blob */}
      <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </Box>
    </Box>
  );

  // Si on veut l'effet de survol (rebond), on enveloppe dans motion.div
  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        style={{ height: '100%' }}
      >
        {Content}
      </motion.div>
    );
  }

  return Content;
};

export default GlassCard;