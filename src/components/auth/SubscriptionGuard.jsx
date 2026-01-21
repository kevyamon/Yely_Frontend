// src/components/auth/SubscriptionGuard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { checkSubscriptionStatus } from '../../features/subscription/subscriptionSlice';
import { Box, CircularProgress, Typography } from '@mui/material';

const SubscriptionGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { subscriptionStatus } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // 1. Vérification initiale + Intervalle (toutes les 60s)
  useEffect(() => {
    if (user && user.role === 'driver') {
      // Première vérif
      dispatch(checkSubscriptionStatus())
        .unwrap()
        .finally(() => setIsChecking(false));

      // Vérif périodique (Le Mur se réveille toutes les minutes)
      const interval = setInterval(() => {
        dispatch(checkSubscriptionStatus());
      }, 60000);

      return () => clearInterval(interval);
    } else {
      setIsChecking(false);
    }
  }, [dispatch, user]);

  // Si on charge encore, on montre un petit rond
  if (isChecking) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // --- LOGIQUE DU MUR ---
  
  // Si ce n'est pas un chauffeur, il passe (Client ou Admin)
  if (!user || user.role !== 'driver') {
    return children;
  }

  // Si le statut est 'inactive' ET qu'on n'est pas déjà sur la page d'abonnement
  if (subscriptionStatus === 'inactive' && location.pathname !== '/subscription') {
    return <Navigate to="/subscription" replace />;
  }

  // Si le statut est 'active' ET qu'on essaie d'aller sur la page d'abonnement (alors qu'on a déjà payé)
  // On redirige vers l'accueil (Optionnel, mais plus propre)
  if (subscriptionStatus === 'active' && location.pathname === '/subscription') {
    return <Navigate to="/home" replace />;
  }

  // Sinon, la voie est libre
  return children;
};

export default SubscriptionGuard;