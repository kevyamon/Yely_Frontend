// src/pages/HistoryPage.jsx
import React from 'react';
import { Box, Typography, IconButton, Paper, Chip, CircularProgress, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaceIcon from '@mui/icons-material/Place';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { useNavigate } from 'react-router-dom';

// Import de l'API qu'on vient de créer
import { useGetRideHistoryQuery } from '../features/rides/ridesApiSlice';

const HistoryPage = () => {
  const navigate = useNavigate();
  
  // Récupération automatique des données depuis le Backend
  const { data: rides, isLoading, isError } = useGetRideHistoryQuery();

  // Fonction utilitaire pour la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'canceled': return 'error';
      case 'ongoing': return 'warning';
      default: return 'default';
    }
  };

  // Fonction utilitaire pour traduire le statut
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'canceled': return 'Annulée';
      case 'ongoing': return 'En cours';
      default: return status;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, pt: 10, position: 'relative' }}>
      
      {/* HEADER AVEC BOUTON RETOUR */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/home')} 
          sx={{ bgcolor: 'background.paper', boxShadow: 1, mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="900">Mes Courses</Typography>
      </Box>

      {/* 1. ÉTAT DE CHARGEMENT */}
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* 2. ÉTAT D'ERREUR */}
      {isError && (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee', borderRadius: 3 }}>
          <Typography color="error" fontWeight="bold">Impossible de charger l'historique.</Typography>
          <Typography variant="caption" color="error">Vérifiez votre connexion internet</Typography>
        </Paper>
      )}

      {/* 3. AFFICHAGE DES DONNÉES */}
      {!isLoading && !isError && (
        <>
          {rides && rides.length > 0 ? (
            <Stack spacing={2}>
              {rides.map((ride) => (
                <Paper 
                  key={ride._id} 
                  elevation={2} 
                  sx={{ p: 2, borderRadius: 3, borderLeft: '5px solid #FFC107', bgcolor: 'background.paper' }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                        <EventNoteIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {new Date(ride.createdAt).toLocaleDateString()} à {new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {ride.price} FCFA
                      </Typography>
                    </Box>
                    <Chip 
                      label={getStatusLabel(ride.status)} 
                      color={getStatusColor(ride.status)} 
                      size="small" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <PlaceIcon color="primary" sx={{ fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" fontWeight="500">{ride.pickupLocation?.address || "Point de départ"}</Typography>
                  </Box>
                  
                  <Box pl={0.4} display="flex" alignItems="center">
                    <Box sx={{ width: 2, height: 15, bgcolor: '#ddd', ml: 1, mr: 1.8 }} />
                  </Box>

                  <Box display="flex" alignItems="center">
                    <PlaceIcon color="error" sx={{ fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" fontWeight="500">{ride.dropoffLocation?.address || "Destination"}</Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          ) : (
            // 4. ÉTAT VIDE (Aucune course)
            <Box display="flex" flexDirection="column" alignItems="center" mt={8} opacity={0.6}>
              <LocalTaxiIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" align="center" fontWeight="bold">Aucune course effectuée pour le moment.</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default HistoryPage;