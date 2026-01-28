// src/components/ui/AppDrawer.jsx
import { useState } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Switch,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  DriveEta as DriveEtaIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';

function AppDrawer({ open, onClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    onClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const menuItems = [
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Mes Trajets', icon: <HistoryIcon />, path: '/history' },
  ];

  // Ajouter "Devenir Chauffeur" si l'utilisateur est un rider
  if (user?.role === 'rider') {
    menuItems.push({ text: 'Devenir Chauffeur', icon: <DriveEtaIcon />, path: '/become-driver' });
  }

  menuItems.push({ text: 'Mon compte', icon: <AccountCircleIcon />, path: '/account' });

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#fff',
          backgroundImage: 'none',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header avec profil */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#000' }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
            <Avatar
              src={user?.profilePicture}
              sx={{ width: 60, height: 60, border: '3px solid #000' }}
            >
              {user?.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {user?.name || 'Utilisateur'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {user?.role === 'driver' ? '🚗 Chauffeur' : '👤 Passager'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <List sx={{ flex: 1, px: 2, py: 2 }}>
          {/* Mode Nuit */}
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <DarkModeIcon sx={{ color: '#FFD700' }} />
              </ListItemIcon>
              <ListItemText primary="Mode Nuit" />
              <Switch
                checked={mode === 'dark'}
                onChange={handleThemeToggle}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FFD700',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#FFD700',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* 👑 BOUTON DASHBOARD ADMIN */}
          {(user?.role === 'superAdmin' || user?.role === 'admin') && (
            <>
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 215, 0, 0.2)' }} />
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation('/admin/dashboard')}
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.2)' },
                  }}
                >
                  <ListItemIcon sx={{ color: '#FFD700' }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={user?.role === 'superAdmin' ? '👑 Dashboard Admin' : '🛡️ Dashboard Staff'}
                    primaryTypographyProps={{ fontWeight: 'bold', color: '#FFD700' }}
                  />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 215, 0, 0.2)' }} />
            </>
          )}

          {/* Autres menus */}
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Déconnexion */}
          <ListItem disablePadding sx={{ mt: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' },
              }}
            >
              <ListItemIcon sx={{ color: '#f44336' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Se déconnecter" primaryTypographyProps={{ color: '#f44336' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default AppDrawer;