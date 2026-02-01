// src/pages/driver/DriverHome.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Badge, useTheme, Card, CardContent, Switch } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useGetNotificationsQuery } from '../../features/notifications/notificationsApiSlice';
import { useAcceptRideMutation, useStartRideMutation, useCompleteRideMutation } from '../../features/rides/ridesApiSlice';
import { showToast } from '../../features/common/uiSlice';
import socketService from '../../services/socketService';

import AppDrawer from '../../components/ui/AppDrawer'; 
import LeafletMap from '../../components/map/LeafletMap';
import DriverRequestModal from '../../components/ui/DriverRequestModal';
import RideSummaryModal from '../../components/ui/RideSummaryModal'; // <--- IMPORT PROPRE

import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const DriverHome = ({ user, userLocation }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const [rideStatus, setRideStatus] = useState(0); 
  const [activeRideId, setActiveRideId] = useState(null);
  const [incomingRide, setIncomingRide] = useState(null);
  
  // États pour le résumé
  const [showSummary, setShowSummary] = useState(false);
  const [completedRideData, setCompletedRideData] = useState(null);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch();

  const [acceptRide] = useAcceptRideMutation();
  const [startRide] = useStartRideMutation();
  const [completeRide] = useCompleteRideMutation();
  
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { skip: !user });
  const unreadCount = useMemo(() => Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, [notifications]);

  // --- SOCKETS ---
  useEffect(() => {
    if (!user) return;

    const handleNewRequest = (ride) => {
      console.log("⚡ OFFRE REÇUE :", ride);
      if (rideStatus === 0 && isOnline) {
          setIncomingRide(ride);
          setRideStatus(1);
      }
    };

    const handleRideCancelled = ({ rideId }) => {
        console.log("🚫 Course annulée :", rideId);
        if ((incomingRide && incomingRide._id === rideId) || (activeRideId === rideId)) {
            setIncomingRide(null);
            setActiveRideId(null);
            setRideStatus(0);
            dispatch(showToast({ message: 'Course annulée par le client', type: 'info' }));
        }
    };

    socketService.on('new_ride_request', handleNewRequest);
    socketService.on('ride_cancelled', handleRideCancelled);

    return () => {
      socketService.off('new_ride_request', handleNewRequest);
      socketService.off('ride_cancelled', handleRideCancelled);
    };
  }, [user, rideStatus, isOnline, incomingRide, activeRideId]);

  // --- TRACKING GPS ---
  useEffect(() => {
    if (isOnline && !userLocation.coordinates.lat) return;
    let interval;
    if (isOnline && userLocation.coordinates.lat) {
      const sendPos = () => {
        if (socketService.isConnected) {
            socketService.emit('update_location', {
              userId: user._id, 
              role: 'driver',
              rideId: activeRideId, 
              coordinates: { lat: userLocation.coordinates.lat, lng: userLocation.coordinates.lng }
            });
        }
      };
      sendPos();
      interval = setInterval(sendPos, 5000); 
    }
    return () => clearInterval(interval);
  }, [isOnline, userLocation, user, activeRideId]);


  // --- ACTIONS ---
  const handleAcceptRide = async () => {
    if (!incomingRide) return;
    try {
        const result = await acceptRide(incomingRide._id).unwrap();
        setActiveRideId(result._id);
        setIncomingRide(null);
        setRideStatus(2); 
        dispatch(showToast({ message: 'Course acceptée ! 🏁', type: 'success' }));
    } catch (error) {
        dispatch(showToast({ message: 'Erreur acceptation', type: 'error' }));
        setIncomingRide(null);
        setRideStatus(0);
    }
  };

  const handleDeclineRide = () => {
      setIncomingRide(null);
      setRideStatus(0);
  };

  const handleNextStep = async () => {
    if (!activeRideId) return;
    try {
      if (rideStatus === 2) { 
        await startRide(activeRideId).unwrap();
        setRideStatus(3); 
        dispatch(showToast({ message: 'Course démarrée ! 🚕', type: 'info' }));
      } else if (rideStatus === 3) { 
        // 🏁 FIN DE COURSE
        const result = await completeRide(activeRideId).unwrap();
        
        // On prépare le résumé
        setCompletedRideData(result);
        setShowSummary(true); 

        // On reset l'état de course immédiatement en arrière-plan
        setRideStatus(0); 
        setActiveRideId(null);
      }
    } catch (error) {
      console.error(error);
      dispatch(showToast({ message: 'Erreur technique', type: 'error' }));
    }
  };

  const closeSummary = () => {
      setShowSummary(false);
      setCompletedRideData(null);
  };

  const toggleOnline = () => setIsOnline(!isOnline);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      
      {/* --- LES MODALS --- */}
      
      {/* 1. Proposition de course */}
      <DriverRequestModal 
        isVisible={rideStatus === 1 && incomingRide} 
        ride={incomingRide}
        onAccept={handleAcceptRide}
        onDecline={handleDeclineRide}
      />

      {/* 2. Résumé de Fin (C'est propre maintenant !) */}
      <RideSummaryModal 
        isVisible={showSummary}
        ride={completedRideData} 
        userRole="driver" 
        onClose={closeSummary} 
      />

      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* HEADER */}
      <Box sx={{ p: 2, pt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, bgcolor: 'background.paper' }}>
        <Box>
          <Typography variant="h4" fontWeight="900"><span style={{ color: '#FFC107' }}>Y</span>ély</Typography>
          <Typography variant="body2" color="text.secondary">Chauffeur</Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)}><Badge color="error" variant="dot" invisible={unreadCount === 0}><MenuIcon /></Badge></IconButton>
      </Box>

      {/* PANNEAU CONTRÔLE */}
      {activeRideId ? (
        <Box sx={{ p: 2, bgcolor: isDark ? '#1a1a1a' : '#fff3e0', borderBottom: '2px solid #FFC107', zIndex: 101 }}>
          <Typography variant="subtitle2" fontWeight="bold" align="center" sx={{ mb: 1, color: '#FFC107' }}>
            {rideStatus === 2 ? "📍 EN APPROCHE" : "🚀 EN ROUTE"}
          </Typography>
          <Button fullWidth variant="contained" size="large" onClick={handleNextStep}
            sx={{ 
              bgcolor: rideStatus === 2 ? '#2196F3' : '#4CAF50', color: 'white', py: 2, borderRadius: '16px', fontWeight: 'bold',
              '&:hover': { bgcolor: rideStatus === 2 ? '#1976D2' : '#43A047' }
            }}>
            {rideStatus === 2 ? 'CLIENT À BORD' : 'TERMINER LA COURSE'}
          </Button>
        </Box>
      ) : (
        <Box sx={{ px: 2, py: 1.5, zIndex: 99 }}>
            <Card sx={{ borderRadius: '16px' }}>
                <CardContent sx={{ p: '12px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight="bold" color={isOnline ? 'success.main' : 'error.main'}>
                        {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
                    </Typography>
                    <Switch checked={isOnline} onChange={toggleOnline} color="success" />
                </CardContent>
            </Card>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <LeafletMap userLocation={userLocation} />
      </Box>
    </Box>
  );
};

export default DriverHome;