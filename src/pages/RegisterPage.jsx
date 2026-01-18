// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack, IconButton, CircularProgress, Alert, Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import AppInput from '../components/ui/AppInput';

// Icônes
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';
import PaletteIcon from '@mui/icons-material/Palette';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  
  const [role, setRole] = useState('rider');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    vehicleModel: '', vehiclePlate: '', vehicleColor: ''
  });

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/login');
    }
    return () => { dispatch(reset()); };
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    if (isError) dispatch(reset());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: formData.name, email: formData.email, phone: formData.phone, password: formData.password, role: role,
      ...(role === 'driver' && { vehicleModel: formData.vehicleModel, vehiclePlate: formData.vehiclePlate, vehicleColor: formData.vehicleColor }),
    };
    dispatch(register(userData));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8f9fa', 
      px: 2, py: 4,
      // --- CORRECTIF ANTI-MODE NUIT ---
      color: 'black', // Force le texte général en noir
      '& .MuiInputBase-root': { color: 'black' }, // Force le texte des inputs en noir
      '& .MuiInputLabel-root': { color: '#666' }, // Force les labels en gris
      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.2)' }, // Force les bordures visibles
      // --------------------------------
    }}>
      
      <Stack direction="row" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2, bgcolor: 'white', boxShadow: 1, color: 'black' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">Créer un compte</Typography>
      </Stack>

      <Collapse in={isError}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(255, 0, 0, 0.1)', fontWeight: 'bold' }}>
          {message}
        </Alert>
      </Collapse>

      {/* SÉLECTEUR RÔLE */}
      <Paper elevation={0} sx={{ p: 1, bgcolor: '#e0e0e0', borderRadius: 50, mb: 4, display: 'flex' }}>
        {['rider', 'driver'].map((r) => (
          <Button
            key={r} fullWidth onClick={() => setRole(r)} variant={role === r ? 'contained' : 'text'}
            sx={{
              borderRadius: 50, py: 1.5, fontWeight: 'bold',
              bgcolor: role === r ? 'black' : 'transparent',
              color: role === r ? 'white' : 'gray',
              '&:hover': { bgcolor: role === r ? '#333' : '#d5d5d5' }
            }}
          >
            {r === 'rider' ? 'Passager 🚶' : 'Chauffeur 🚖'}
          </Button>
        ))}
      </Paper>

      <form onSubmit={handleSubmit}>
        <AppInput name="name" value={formData.name} label="Nom complet" icon={<PersonIcon />} onChange={handleChange} />
        <AppInput name="email" value={formData.email} label="Email" type="email" icon={<EmailIcon />} onChange={handleChange} />
        <AppInput name="phone" value={formData.phone} label="Téléphone" type="tel" onChange={handleChange} />
        <AppInput name="password" value={formData.password} label="Mot de passe" type="password" icon={<LockIcon />} onChange={handleChange} />

        <AnimatePresence>
          {role === 'driver' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <Box sx={{ mt: 2, p: 3, bgcolor: 'white', borderRadius: 4, border: '1px solid #FFC107', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" mb={2} color="primary">INFOS VÉHICULE</Typography>
                <AppInput name="vehicleModel" value={formData.vehicleModel} label="Modèle (ex: Toyota)" icon={<DirectionsCarIcon />} onChange={handleChange} />
                <AppInput name="vehiclePlate" value={formData.vehiclePlate} label="Immatriculation" icon={<BadgeIcon />} onChange={handleChange} />
                <AppInput name="vehicleColor" value={formData.vehicleColor} label="Couleur du véhicule" icon={<PaletteIcon />} onChange={handleChange} />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isLoading} 
          sx={{ py: 2, borderRadius: 50, fontWeight: 'bold', fontSize: '1.1rem', mt: 2, boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)' }}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "S'INSCRIRE"}
        </Button>
      </form>

      <Box textAlign="center" mt={3}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Déjà un compte ?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#FFC107', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Se connecter</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;