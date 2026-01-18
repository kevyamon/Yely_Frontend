import React from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, pt: 8 }}>
      <IconButton onClick={() => navigate('/home')} sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'background.paper' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" fontWeight="900" mb={4}>Notifications</Typography>
      
      <List>
        <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 2 }}>
          <ListItemIcon><NotificationsIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Bienvenue sur Yély !" secondary="Il y a 2 jours" />
        </ListItem>
        <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 2 }}>
           <ListItemIcon><NotificationsIcon color="error" /></ListItemIcon>
          <ListItemText primary="Rappel Abonnement" secondary="N'oubliez pas de renouveler votre pass." />
        </ListItem>
      </List>
    </Box>
  );
};
export default NotificationsPage;