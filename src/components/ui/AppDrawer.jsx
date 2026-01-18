import React from 'react';
import { Box, Typography, Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, Badge, Switch, Stack } from '@mui/material'; // Ajout Switch, Stack
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice'; // <--- IMPORT ACTION

// Icônes
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Lune
import LightModeIcon from '@mui/icons-material/LightMode'; // Soleil

const AppDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme); // Récupère le mode actuel

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const drawerContent = (
    <Box 
      sx={{ 
        width: 280, 
        height: '100%', 
        // On utilise les couleurs du thème maintenant !
        bgcolor: 'background.paper', 
        color: 'text.primary',
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
    >
      {/* PROFIL */}
      <Box sx={{ mb: 4, mt: 2, display: 'flex', alignItems: 'center', p: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'black', width: 50, height: 50, mr: 2, fontWeight: 'bold' }}>
          {user ? user.name.charAt(0).toUpperCase() : 'Y'}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user ? user.name.split(' ')[0] : 'Utilisateur'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Voir mon profil
          </Typography>
        </Box>
        <ChevronRightIcon sx={{ ml: 'auto', color: 'text.secondary' }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* SWITCH MODE JOUR/NUIT (NOUVEAU) */}
      <Box sx={{ px: 2, py: 1, mb: 2, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            {mode === 'dark' ? <DarkModeIcon color="primary" /> : <LightModeIcon color="warning" />}
            <Typography variant="body2" fontWeight="bold">
              Mode {mode === 'dark' ? 'Nuit' : 'Jour'}
            </Typography>
          </Stack>
          <Switch 
            checked={mode === 'dark'} 
            onChange={() => dispatch(toggleTheme())} 
            color="primary"
          />
        </Stack>
      </Box>

      {/* MENU ITEMS */}
      <List>
        <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 15, minWidth: 15 } }}>
              <NotificationsNoneIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItemButton>

        <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon sx={{ color: 'text.primary' }}>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Mes courses" />
        </ListItemButton>

        <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon sx={{ color: 'text.primary' }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Mon compte" />
        </ListItemButton>
      </List>

      {/* DÉCONNEXION */}
      <Box sx={{ mt: 'auto', mb: 2 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          color="error" 
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: 3, textTransform: 'none' }}
        >
          Se déconnecter
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          // Glassmorphism adapté au thème
          bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AppDrawer;