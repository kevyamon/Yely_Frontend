// src/pages/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
// AJOUT DE 'IconButton' dans les imports
import { Box, Typography, Button, Paper, Radio, useTheme, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { paySubscription, resetSubscriptionState } from '../features/subscription/subscriptionSlice';
import { logout, reset } from '../features/auth/authSlice';

// Icônes
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // <--- AJOUT IMPORT

const PlanCard = ({ title, price, duration, selected, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      component={motion.div}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      elevation={selected ? 10 : 1}
      sx={{
        p: 3, mb: 2, cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        border: selected ? '2px solid #FFC107' : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        background: selected 
          ? (isDark ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.05)') 
          : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
        borderRadius: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s ease'
      }}
    >
      <Box display="flex" alignItems="center">
        <Radio checked={selected} sx={{ color: '#FFC107', '&.Mui-checked': { color: '#FFC107' } }} />
        <Box ml={1}>
          <Typography variant="h6" fontWeight="bold" color={selected ? '#FFC107' : 'text.primary'}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Valide {duration}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h5" fontWeight="900" sx={{ color: isDark ? 'white' : 'black' }}>
        {price} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>FCFA</span>
      </Typography>
    </Paper>
  );
};

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('daily'); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isSuccess } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetSubscriptionState());
      navigate('/home');
    }
  }, [isSuccess, navigate, dispatch]);

  const handlePayment = () => {
    dispatch(paySubscription({ plan: selectedPlan, paymentMethod: 'Wave' }));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      p: 3, 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Fond décoratif */}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, bgcolor: '#FFC107', filter: 'blur(150px)', opacity: 0.2 }} />

      {/* --- NOUVEAU BOUTON RETOUR --- */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: 3,
                '&:hover': { bgcolor: 'background.paper' } 
            }}
        >
            <ArrowBackIcon />
        </IconButton>
      </Box>
      {/* ----------------------------- */}

      <Box sx={{ zIndex: 1, maxWidth: 500, mx: 'auto', width: '100%' }}>
        
        {/* HEADER */}
        <Box textAlign="center" mb={6}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <Box sx={{ 
              width: 80, height: 80, mx: 'auto', mb: 2, 
              bgcolor: 'rgba(255, 193, 7, 0.2)', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(255, 193, 7, 0.3)'
            }}>
              <WorkspacePremiumIcon sx={{ fontSize: 40, color: '#FFC107' }} />
            </Box>
          </motion.div>
          
          <Typography variant="h4" fontWeight="900" gutterBottom>
            Espace Chauffeur
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Votre abonnement a expiré. <br/> Choisissez une formule pour prendre la route.
          </Typography>
        </Box>

        {/* CARTES D'ABONNEMENT */}
        <Box mb={4}>
          <PlanCard 
            title="Pass 24 Heures" 
            price="200" 
            duration="24h" 
            selected={selectedPlan === 'daily'} 
            onClick={() => setSelectedPlan('daily')} 
          />
          
          <PlanCard 
            title="Pass Semaine" 
            price="1000" 
            duration="7 jours" 
            selected={selectedPlan === 'weekly'} 
            onClick={() => setSelectedPlan('weekly')} 
          />
          {selectedPlan === 'weekly' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Typography variant="caption" sx={{ color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: -1, mb: 2, fontWeight: 'bold' }}>
                <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> Meilleure offre : Économisez 400 FCFA
              </Typography>
            </motion.div>
          )}
        </Box>

        {/* BOUTON PAYER */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePayment}
          disabled={isLoading}
          sx={{ 
            bgcolor: '#1b9df0', // Bleu Wave
            color: 'white', 
            py: 2, 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            borderRadius: '16px',
            boxShadow: '0 10px 20px rgba(27, 157, 240, 0.3)',
            '&:hover': { bgcolor: '#0084d6' }
          }}
        >
          {isLoading ? <CircularProgress size={26} color="inherit" /> : `Payer avec Wave (${selectedPlan === 'daily' ? '200' : '1000'} F)`}
        </Button>

        {/* LIEN DÉCONNEXION */}
        <Button 
          startIcon={<LogoutIcon />} 
          onClick={handleLogout}
          sx={{ mt: 4, color: 'text.secondary', textTransform: 'none', width: '100%' }}
        >
          Se déconnecter
        </Button>

      </Box>
    </Box>
  );
};

export default SubscriptionPage;