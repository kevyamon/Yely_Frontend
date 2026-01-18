// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Stack, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import AppInput from '../components/ui/AppInput';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isSuccess || user) { navigate('/home'); }
    return () => { dispatch(reset()); };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ emailOrPhone: formData.email, password: formData.password }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8f9fa', 
      px: 2, py: 4,
      // --- CORRECTIF ANTI-MODE NUIT ---
      color: 'black',
      '& .MuiInputBase-root': { color: 'black' },
      '& .MuiInputLabel-root': { color: '#666' },
      '& .MuiTypography-root': { color: 'black' }, // Force les titres en noir
      '& .MuiTypography-colorTextSecondary': { color: '#666 !important' }, // Force les sous-titres en gris
      // --------------------------------
    }}>
      <Stack direction="row" alignItems="center" mb={6}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2, bgcolor: 'white', boxShadow: 1, color: 'black' }}>
          <ArrowBackIcon />
        </IconButton>
      </Stack>

      <Box mb={6}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Bon retour ! 👋</Typography>
        <Typography variant="body1" color="textSecondary">Connectez-vous pour continuer.</Typography>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 3 }}>{message}</Alert>}

      <form onSubmit={handleSubmit}>
        <AppInput name="email" label="Email ou Téléphone" type="text" icon={<EmailIcon />} onChange={handleChange} />
        <AppInput name="password" label="Mot de passe" type="password" icon={<LockIcon />} onChange={handleChange} />

        <Button 
          type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isLoading}
          sx={{ py: 2, borderRadius: 50, fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)', mt: 4 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "SE CONNECTER"}
        </Button>
      </form>

      <Box textAlign="center" mt={4}>
        <Typography variant="body2" color="textSecondary">
          Pas encore de compte ?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#FFC107', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>S'inscrire</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;