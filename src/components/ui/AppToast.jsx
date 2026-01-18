// src/components/ui/AppToast.jsx
import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../../features/common/uiSlice';

// Animation de glissement vers le bas
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const AppToast = () => {
  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.ui);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch(hideToast());
  };

  // Styles dynamiques selon le type
  const getAlertStyle = () => {
    switch (toast.severity) {
      case 'error':
        return { bgcolor: '#ff4444', color: 'white' };
      case 'success':
        return { bgcolor: '#00C851', color: 'white' };
      default: // 'info' -> Ton style Jaune préféré
        return { bgcolor: '#FFC107', color: 'black' };
    }
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }} // Marge pour ne pas coller au plafond
    >
      <Alert 
        onClose={handleClose} 
        severity={toast.severity} 
        variant="filled"
        sx={{ 
          width: '100%', 
          borderRadius: 50, 
          px: 3, 
          fontWeight: 'bold', 
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
          ...getAlertStyle() // Applique la couleur
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default AppToast;