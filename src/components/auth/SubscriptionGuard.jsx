// src/components/auth/SubscriptionGuard.jsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { checkSubscriptionStatus } from '../../features/subscription/subscriptionSlice';
import { Box, CircularProgress } from '@mui/material';

const SubscriptionGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { subscriptionStatus } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user && user.role === 'driver') {
      dispatch(checkSubscriptionStatus())
        .unwrap()
        .finally(() => setIsChecking(false));

      const interval = setInterval(() => {
        dispatch(checkSubscriptionStatus());
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setIsChecking(false);
    }
  }, [dispatch, user]);

  if (isChecking) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user || user.role !== 'driver') {
    return children;
  }

  if (subscriptionStatus === 'inactive' && location.pathname !== '/subscription') {
    return <Navigate to="/subscription" replace />;
  }

  if (subscriptionStatus === 'active' && location.pathname === '/subscription') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default SubscriptionGuard;