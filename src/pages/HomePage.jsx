// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button, Badge, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

// Composants Réutilisables
import VehicleCarousel from '../components/ui/VehicleCarousel'; 
import VehicleCard from '../components/ui/VehicleCard';
import AppDrawer from '../components/ui/AppDrawer'; 

// Icônes
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

// --- FOND ANIMÉ ADAPTATIF (JOUR/NUIT) ---
const LiquidBackground = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      position: 'fixed', inset: 0, zIndex: 0, 
      // La couleur de fond change automatiquement selon le thème (Noir ou Blanc)
      bgcolor: theme.palette.background.default, 
      overflow: 'hidden',
      transition: 'background-color 0.5s ease' // Transition douce entre jour et nuit
    }}>
      {/* Blob Jaune qui flotte */}
      <motion.div
        animate={{ x: [-50, 50, -50], y: [-20, 20, -20], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '250px', height: '250px',
          // En mode Nuit : Lueur subtile. En mode Jour : Lueur un peu plus forte pour se voir sur le blanc.
          background: isDark 
            ? 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, rgba(0,0,0,0) 70%)' 
            : 'radial-gradient(circle, rgba(255,193,7,0.25) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(50px)', borderRadius: '50%'
        }}
      />
    </Box>
  );
};

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme(); // On récupère le thème pour les conditions
  const isDark = theme.palette.mode === 'dark';
  
  // État local pour gérer l'ouverture du menu
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* Fond Dynamique */}
      <LiquidBackground />

      {/* Menu Latéral */}
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Box sx={{ position: 'relative', zIndex: 1, p: 2, pt: 6, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ lineHeight: 1, letterSpacing: -1, mb: 0.5 }}>
              <span style={{ color: '#FFC107' }}>Y</span>
              {/* La couleur de "ély" change auto (Blanc la nuit, Noir le jour) */}
              <span style={{ color: theme.palette.text.primary }}>ély</span>
            </Typography>
            <Typography variant="body1" fontWeight="500" sx={{ color: 'text.secondary' }}>
              Salut, {user ? user.name.split(' ')[0] : 'Kevy'} 👋
            </Typography>
          </Box>
          
          {/* BOUTON HAMBURGER */}
          <IconButton 
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              // Le fond du bouton s'adapte aussi
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
              color: 'text.primary', 
              borderRadius: '12px' 
            }}
          >
            <Badge color="error" variant="dot" invisible={false}>
              <MenuIcon />
            </Badge>
          </IconButton>
        </Box>

        {/* INPUT RECHERCHE */}
        <Box mb={4}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center',
              // Glassmorphism adaptatif
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '16px', p: 0.5, pl: 2,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            }}
          >
            <SearchIcon sx={{ color: '#FFC107', mr: 1 }} />
            <InputBase
              placeholder="Où va-t-on ?"
              fullWidth
              sx={{ 
                color: 'text.primary', 
                fontSize: '1rem', 
                '& input::placeholder': { color: 'text.secondary', opacity: 0.7 } 
              }}
            />
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#FFC107', color: 'black', borderRadius: '12px', minWidth: '40px', px: 2, fontWeight: 'bold' }}
            >
               GO
            </Button>
          </Box>
        </Box>

        {/* ZONE VIDE (Placeholder Carte) */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                (La carte s'affichera ici)
            </Typography>
        </Box>

        {/* CARROUSEL */}
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2, ml: 1 }}>
                Choisissez votre confort
            </Typography>
            <VehicleCarousel />
        </Box>

      </Box>
    </Box>
  );
};

export default HomePage;