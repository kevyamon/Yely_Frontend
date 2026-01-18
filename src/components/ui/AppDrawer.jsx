// src/components/ui/AppDrawer.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, Badge, Switch, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../../features/notifications/notificationsApiSlice';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const AppDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  // Récupération des notifications (Tableau vide par défaut si erreur)
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    skip: !user, 
    refetchOnMountOrArgChange: true,
  });

  const [markAllAsRead] = useMarkAllAsReadMutation();

  // Calcul dynamique : Si erreur 404, notifications est [], donc unreadCount sera 0
  const unreadCount = useMemo(() => {
    return Array.isArray(notifications) 
      ? notifications.filter(n => !n.isRead).length 
      : 0;
  }, [notifications]);

  const handleNotificationClick = async () => {
    navigate('/notifications');
    onClose();
    if (unreadCount > 0) {
      try { await markAllAsRead().unwrap(); } catch (err) { console.error(err); }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const handleNavigate = (path) => { navigate(path); onClose(); };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper', color: 'text.primary', p: 2, display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER PROFIL */}
      <Box onClick={() => handleNavigate('/profile')} sx={{ mb: 4, mt: 2, display: 'flex', alignItems: 'center', p: 1, cursor: 'pointer', borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'black', width: 50, height: 50, mr: 2, fontWeight: 'bold' }}>
          {user ? user.name.charAt(0).toUpperCase() : 'Y'}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">{user ? user.name.split(' ')[0] : 'Utilisateur'}</Typography>
          <Typography variant="caption" color="text.secondary">Voir mon profil</Typography>
        </Box>
        <ChevronRightIcon sx={{ ml: 'auto', color: 'text.secondary' }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* SWITCH MODE */}
      <Box sx={{ px: 2, py: 1, mb: 2, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            {mode === 'dark' ? <DarkModeIcon color="primary" /> : <LightModeIcon color="warning" />}
            <Typography variant="body2" fontWeight="bold">Mode {mode === 'dark' ? 'Nuit' : 'Jour'}</Typography>
          </Stack>
          <Switch checked={mode === 'dark'} onChange={() => dispatch(toggleTheme())} color="primary" />
        </Stack>
      </Box>

      <List>
        {/* BOUTON NOTIFICATIONS CORRIGÉ */}
        <ListItemButton onClick={handleNotificationClick} sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <Badge 
              badgeContent={unreadCount} 
              color="error" 
              invisible={unreadCount === 0} // <--- C'EST CETTE LIGNE QUI CACHE LE BADGE SI 0
              sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}
            >
              <NotificationsNoneIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary="Notifications" 
            secondary={unreadCount > 0 ? `${unreadCount} nouvelle(s)` : null}
            secondaryTypographyProps={{ fontSize: '0.7rem', color: 'error.main' }}
          />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigate('/history')} sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon sx={{ color: 'text.primary' }}><HistoryIcon /></ListItemIcon>
          <ListItemText primary="Mes courses" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigate('/account')} sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon sx={{ color: 'text.primary' }}><PersonIcon /></ListItemIcon>
          <ListItemText primary="Mon compte" />
        </ListItemButton>
      </List>

      <Box sx={{ mt: 'auto', mb: 2 }}>
        <Button fullWidth variant="outlined" color="error" startIcon={<ExitToAppIcon />} onClick={handleLogout} sx={{ borderRadius: 3, textTransform: 'none' }}>
          Se déconnecter
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', boxShadow: '-10px 0 30px rgba(0,0,0,0.2)' } }}>
      {drawerContent}
    </Drawer>
  );
};

export default AppDrawer;