// src/pages/NotificationsPage.jsx
import React from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, ListItemIcon, CircularProgress, Paper, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';

// Import RTK Query
import { useGetNotificationsQuery } from '../features/notifications/notificationsApiSlice';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Récupération des données (Cache ou Live)
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();

  // Fonction pour choisir l'icône selon le type
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <WarningIcon color="error" />;
      default: return <InfoIcon color="primary" />; // info
    }
  };

  // Formattage date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, pt: 8 }}>
      <IconButton onClick={() => navigate('/home')} sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'background.paper', boxShadow: 1 }}>
        <ArrowBackIcon />
      </IconButton>
      
      <Typography variant="h4" fontWeight="900" mb={4}>Notifications</Typography>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : notifications.length === 0 ? (
        <Typography color="text.secondary" align="center" mt={4}>
          Aucune notification pour le moment.
        </Typography>
      ) : (
        <List>
          {notifications.map((notif) => (
            <Paper 
              key={notif._id}
              elevation={0}
              sx={{ 
                mb: 1.5, 
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: notif.isRead ? 'transparent' : 'primary.main', // Bordure jaune si non lu
                overflow: 'hidden'
              }}
            >
              <ListItem alignItems="flex-start">
                <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                  {getIcon(notif.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                      {notif.title}
                    </Typography>
                  } 
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="text.secondary" component="span" display="block" sx={{ mb: 1 }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {formatDate(notif.createdAt)}
                      </Typography>
                    </React.Fragment>
                  } 
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationsPage;