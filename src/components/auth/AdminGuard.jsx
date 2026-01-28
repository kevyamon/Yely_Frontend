// src/components/auth/AdminGuard.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';

const AdminGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = user.role === 'admin' || user.role === 'superAdmin';

  if (!isAdmin) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography variant="h4" fontWeight="900" color="error">
          ⛔ Accès Refusé
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cette section est réservée aux administrateurs
        </Typography>
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ mt: 2, cursor: 'pointer' }}
          onClick={() => window.location.href = '/home'}
        >
          ← Retour à l'accueil
        </Typography>
      </Box>
    );
  }

  return children;
};

export default AdminGuard;