// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Box, Typography, Button, Dialog, DialogContent, Stack, Slide } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import de la vidéo
import welcomeVideo from '../assets/welcome.mp4';

// Icônes
import SecurityIcon from '@mui/icons-material/Security';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SavingsIcon from '@mui/icons-material/Savings';

// Transition fluide pour le Modal (Compatible MUI pour éviter les erreurs console)
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// --- SPLASH SCREEN ---
const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#000000',
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 5, 1], opacity: [0, 1, 1], rotate: [0, 0, 0, 360] }}
          transition={{ duration: 1.5, times: [0, 0.6, 1], ease: "easeInOut" }}
        >
          <Typography variant="h1" sx={{ color: '#FFC107', fontSize: '6rem', fontWeight: 'bold' }}>Y</Typography>
        </motion.div>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5, type: "spring" }}
        >
          <Typography variant="h1" sx={{ color: 'white', fontSize: '6rem', fontWeight: 'bold' }}>ély</Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

// Composant Carte Argument
const FeatureItem = ({ icon, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: delay, duration: 0.5 }}
  >
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={2} 
      mb={1.5} 
      sx={{ 
        bgcolor: 'white', 
        p: 1.5, 
        borderRadius: 4, 
        boxShadow: '0 4px 10px rgba(0,0,0,0.03)' 
      }}
    >
      <Box sx={{ color: '#FFC107' }}>{icon}</Box>
      <Typography variant="body2" fontWeight="600" fontSize="0.95rem">{title}</Typography>
    </Stack>
  </motion.div>
);

const LandingPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  // --- LOGIQUE VIDÉO INTELLIGENTE ---
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleVideoEnd = () => {
    // Pause de 5 secondes avant de relancer
    timeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        // Petite promesse pour éviter les erreurs si la vidéo n'est pas prête
        videoRef.current.play().catch(e => console.log("Lecture auto empêchée:", e));
      }
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
      
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            p: 3,
            pb: 4
          }}
        >
          {/* HEADER */}
          <Box textAlign="center">
             <Typography variant="h3" color="primary" fontWeight="900" sx={{ letterSpacing: -1 }}>Yély</Typography>
             <Typography variant="body1" color="textSecondary" sx={{ opacity: 0.8 }}>Votre ville, votre trajet.</Typography>
          </Box>

          {/* VIDÉO INTELLIGENTE */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%',
            maxHeight: '35vh',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <video
                ref={videoRef}
                src={welcomeVideo}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                style={{ 
                  height: '100%', 
                  width: 'auto',
                  maxHeight: '30vh', 
                  borderRadius: '20px',
                  objectFit: 'contain'
                }}
              />
            </motion.div>
          </Box>

          {/* ARGUMENTS */}
          <Box width="100%">
            <FeatureItem icon={<FlashOnIcon />} title="Chauffeurs disponibles 24h/7" delay={0.4} />
            <FeatureItem icon={<SecurityIcon />} title="Trajets sécurisés et suivis" delay={0.6} />
            <FeatureItem icon={<SavingsIcon />} title="Prix juste, connu à l'avance" delay={0.8} />
          </Box>

          {/* BOUTON COMMANDER */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            style={{ width: '100%' }}
          >
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              onClick={() => setOpenModal(true)}
              sx={{ 
                borderRadius: 50, 
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0px 10px 25px rgba(255, 193, 7, 0.5)',
                textTransform: 'none',
                color: 'black'
              }}
            >
              Commander un Taxi 🚖
            </Button>
          </motion.div>
        </Box>
      )}

      {/* MODAL */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: { borderRadius: 5, padding: 1, width: '90%', maxWidth: '400px', position: 'absolute', bottom: 20, m: 0 }
        }}
      >
        <DialogContent>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>Bienvenue ! 👋</Typography>
          <Typography align="center" color="textSecondary" mb={4}>Avez-vous déjà un compte Yély ?</Typography>
          <Stack spacing={2}>
            <Button variant="contained" color="primary" fullWidth size="large" onClick={() => navigate('/login')} sx={{ borderRadius: 3, fontWeight: 'bold' }}>OUI, ME CONNECTER</Button>
            <Button variant="outlined" color="inherit" fullWidth size="large" onClick={() => navigate('/register')} sx={{ borderRadius: 3, borderWidth: 2, fontWeight: 'bold' }}>NON, CRÉER UN COMPTE</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandingPage;