// src/pages/driver/DriverHome.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Badge, useTheme, Card, CardContent, Switch } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useGetNotificationsQuery } from '../../features/notifications/notificationsApiSlice';
import { useAcceptRideMutation, useStartRideMutation, useCompleteRideMutation } from '../../features/rides/ridesApiSlice'; // AJOUTER useAcceptRideMutation
import { showToast } from '../../features/common/uiSlice';
import socketService from '../../services/socketService';

import AppDrawer from '../../components/ui/AppDrawer'; 
import LeafletMap from '../../components/map/LeafletMap';
import DriverRequestModal from '../../components/ui/DriverRequestModal'; // <--- IMPORT MODAL

import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const DriverHome = ({ user, userLocation }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // ÉTATS DE LA COURSE
  // 0: Rien, 1: Proposition (Modal visible), 2: En approche, 3: En cours
  const [rideStatus, setRideStatus] = useState(0); 
  const [activeRideId, setActiveRideId] = useState(null);
  const [incomingRide, setIncomingRide] = useState(null); // La course proposée

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch();

  // MUTATIONS API
  const [acceptRide] = useAcceptRideMutation(); // Importe-le depuis ton slice !
  const [startRide] = useStartRideMutation();
  const [completeRide] = useCompleteRideMutation();
  
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { skip: !user });
  const unreadCount = useMemo(() => Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, [notifications]);

  // --- SOCKETS ---
  useEffect(() => {
    if (!user) return;

    // 1. RECEPTION D'UNE OFFRE (Le Modal doit s'ouvrir)
    const handleNewRequest = (ride) => {
      console.log("⚡ OFFRE REÇUE :", ride);
      // On vérifie qu'on est dispo
      if (rideStatus === 0 && isOnline) {
          setIncomingRide(ride);
          setRideStatus(1); // Mode Proposition
          // Son de notification ici si tu veux
      }
    };

    socketService.on('new_ride_request', handleNewRequest);

    return () => {
      socketService.off('new_ride_request', handleNewRequest);
    };
  }, [user, rideStatus, isOnline]);

  // --- ACTIONS CHAUFFEUR ---

  // A. ACCEPTER LA COURSE (Via le Modal)
  const handleAcceptRide = async () => {
    if (!incomingRide) return;
    try {
        const result = await acceptRide(incomingRide._id).unwrap();
        console.log("✅ Course acceptée :", result);
        
        setActiveRideId(result._id);
        setIncomingRide(null); // On ferme le modal
        setRideStatus(2); // Mode "En Approche"
        
        dispatch(showToast({ message: 'Course acceptée ! Go vers le client 🏁', type: 'success' }));
    } catch (error) {
        console.error("Erreur acceptation:", error);
        dispatch(showToast({ message: 'Erreur: Course déjà prise ou expirée', type: 'error' }));
        setIncomingRide(null);
        setRideStatus(0);
    }
  };

  // B. REFUSER
  const handleDeclineRide = () => {
      // Tu pourras ajouter l'appel API declineRide ici plus tard
      setIncomingRide(null);
      setRideStatus(0);
  };

  // C. CLIENT À BORD -> TERMINER
  const handleNextStep = async () => {
    if (!activeRideId) return;
    try {
      if (rideStatus === 2) {
        // Clic sur "CLIENT À BORD"
        await startRide(activeRideId).unwrap();
        setRideStatus(3); // Mode "En Cours"
        dispatch(showToast({ message: 'Course démarrée ! Bonne route 🚕', type: 'info' }));
      } else if (rideStatus === 3) {
        // Clic sur "TERMINER"
        await completeRide(activeRideId).unwrap();
        setRideStatus(0); 
        setActiveRideId(null);
        dispatch(showToast({ message: 'Course terminée ! 💰', type: 'success' }));
      }
    } catch (error) {
      console.error("Erreur action:", error);
      dispatch(showToast({ message: 'Erreur technique', type: 'error' }));
    }
  };

  const toggleOnline = () => setIsOnline(!isOnline);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      
      {/* 1. MODAL DE PROPOSITION (Glassmorphism) */}
      <DriverRequestModal 
        isVisible={rideStatus === 1 && incomingRide} 
        ride={incomingRide}
        onAccept={handleAcceptRide}
        onDecline={handleDeclineRide}
      />

      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* HEADER */}
      <Box sx={{ p: 2, pt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, bgcolor: 'background.paper' }}>
        <Box>
          <Typography variant="h4" fontWeight="900"><span style={{ color: '#FFC107' }}>Y</span>ély</Typography>
          <Typography variant="body2" color="text.secondary">Mode Chauffeur</Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)}><Badge color="error" variant="dot" invisible={unreadCount === 0}><MenuIcon /></Badge></IconButton>
      </Box>

      {/* PANNEAU DE CONTRÔLE (Séquentiel) */}
      {activeRideId ? (
        <Box sx={{ p: 2, bgcolor: isDark ? '#1a1a1a' : '#fff3e0', borderBottom: '2px solid #FFC107', zIndex: 101 }}>
          <Typography variant="subtitle2" fontWeight="bold" align="center" sx={{ mb: 1, color: '#FFC107' }}>
            {rideStatus === 2 ? "📍 EN APPROCHE (CLIENT EN ATTENTE)" : "🚀 EN ROUTE VERS DESTINATION"}
          </Typography>
          
          <Button 
            fullWidth variant="contained" size="large" onClick={handleNextStep}
            sx={{ 
              bgcolor: rideStatus === 2 ? '#2196F3' : '#4CAF50',
              color: 'white', py: 2, borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem',
              '&:hover': { bgcolor: rideStatus === 2 ? '#1976D2' : '#43A047' }
            }}
          >
            {rideStatus === 2 ? 'CLIENT À BORD (DÉMARRER)' : 'TERMINER LA COURSE'}
          </Button>
        </Box>
      ) : (
        /* SWITCH EN LIGNE (Seulement si pas de course active) */
        <Box sx={{ px: 2, py: 1.5, zIndex: 99 }}>
            <Card sx={{ borderRadius: '16px' }}>
                <CardContent sx={{ p: '12px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight="bold" color={isOnline ? 'success.main' : 'error.main'}>
                        {isOnline ? 'EN LIGNE (Recherche...)' : 'HORS LIGNE'}
                    </Typography>
                    <Switch checked={isOnline} onChange={toggleOnline} color="success" />
                </CardContent>
            </Card>
        </Box>
      )}

      {/* MAP */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <LeafletMap userLocation={userLocation} />
      </Box>
    </Box>
  );
};

export default DriverHome;  