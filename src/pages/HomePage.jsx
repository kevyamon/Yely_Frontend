// src/pages/HomePage.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Box, Typography, IconButton, InputBase, Button, Badge, useTheme, 
  CircularProgress, Paper, Switch, FormControlLabel, Card, CardContent 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Hooks & Services
import useGeolocation from '../hooks/useGeolocation';
import { searchPlaces } from '../services/mapService';
import useDebounce from '../hooks/useDebounce';
import { useGetNotificationsQuery } from '../features/notifications/notificationsApiSlice';
import { useCreateRideMutation } from '../features/rides/ridesApiSlice';
import { showToast } from '../features/common/uiSlice';
import socketService from '../services/socketService';

// Composants
import VehicleCarousel from '../components/ui/VehicleCarousel'; 
import AppDrawer from '../components/ui/AppDrawer'; 
import LeafletMap from '../components/map/LeafletMap';
import RideSearchOverlay from '../components/ui/RideSearchOverlay';
import DriverInfoCard from '../components/ui/DriverInfoCard';

// Icônes
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

// ==================================================================================
// 🚖 INTERFACE CHAUFFEUR (DASHBOARD)
// ==================================================================================
const DriverDashboard = ({ user, userLocation }) => {
  // ✅ DEMANDE CLIENT RESPECTÉE : Par défaut "En Ligne" (true)
  const [isOnline, setIsOnline] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeRideId, setActiveRideId] = useState(null);
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { skip: !user });
  const unreadCount = useMemo(() => Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, [notifications]);

  // --- 1. ÉCOUTE DE LA COURSE (Réception) ---
  useEffect(() => {
    const handleRideStart = (ride) => {
      setActiveRideId(ride._id);
      setIsOnline(true);
    };
    socketService.on('rideAccepted', handleRideStart);
    return () => {
      socketService.off('rideAccepted', handleRideStart);
    };
  }, []);

  // --- 2. SYNCHRONISATION POSITION & STATUT (Émission) ---
  useEffect(() => {
    // 🛑 SÉCURITÉ : Si on est en ligne mais que le GPS n'est pas prêt, on attend.
    // On évite ainsi d'envoyer des commandes "leaveZone" parasites.
    if (isOnline && !userLocation.coordinates.lat) return;

    let interval;
    if (isOnline && userLocation.coordinates.lat) {
      
      const sendPos = () => {
        // Envoi silencieux (plus de console.log qui spam)
        socketService.emit('updateLocation', {
          userId: user._id, 
          role: 'driver',
          rideId: activeRideId, 
          coordinates: { lat: userLocation.coordinates.lat, lng: userLocation.coordinates.lng }
        });
      };

      socketService.emit('joinZone', 'drivers'); 
      sendPos();
      interval = setInterval(sendPos, 5000);

    } else {
      // On quitte la zone SEULEMENT si l'utilisateur a explicitement désactivé (isOnline = false)
      // et que le GPS était déjà chargé (pour éviter le faux positif au démarrage)
      if (userLocation.loaded) {
        socketService.emit('leaveZone', 'drivers'); 
      }
    }
    return () => clearInterval(interval);
  }, [isOnline, userLocation, user, activeRideId]);

  const toggleOnline = () => setIsOnline(!isOnline);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* HEADER */}
      <Box sx={{ p: 2, pt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, bgcolor: 'background.paper', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Box>
          <Typography variant="h4" fontWeight="900"><span style={{ color: '#FFC107' }}>Y</span><span style={{ color: isDark ? 'white' : 'black' }}>ély</span></Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.secondary' }}>Salut, {user?.name?.split(' ')[0] || 'Chauffeur'} 👋</Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ bgcolor: 'action.hover', boxShadow: 1, borderRadius: '12px' }}>
          <Badge color="error" variant="dot" invisible={unreadCount === 0}><MenuIcon /></Badge>
        </IconButton>
      </Box>

      {/* BARRE STATUT */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', boxShadow: 3, zIndex: 99 }}>
        <Card sx={{ bgcolor: isOnline ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', border: '1px solid', borderColor: isOnline ? 'success.main' : 'error.main', borderRadius: '16px', boxShadow: 'none' }}>
          <CardContent sx={{ p: '12px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box display="flex" alignItems="center">
                <PowerSettingsNewIcon sx={{ color: isOnline ? 'success.main' : 'error.main', mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color={isOnline ? 'success.main' : 'error.main'}>{isOnline ? 'EN LIGNE' : 'HORS LIGNE'}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: activeRideId ? 'bold' : 'normal', color: activeRideId ? '#FFC107' : 'inherit' }}>
                    {activeRideId ? '⚠️ Course en cours (Tracking)' : (isOnline ? 'Prêt à recevoir' : 'Repos')}
                  </Typography>
                </Box>
              </Box>
              <Switch checked={isOnline} onChange={toggleOnline} color="success" />
          </CardContent>
        </Card>
      </Box>

      {/* MAP */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <LeafletMap userLocation={userLocation} searchedLocation={null} nearbyTaxis={[]} />
        {!activeRideId && (
          <Box sx={{ position: 'absolute', bottom: 20, left: 10, right: 10, zIndex: 999 }}>
            <Card sx={{ borderRadius: '20px', bgcolor: 'rgba(0,0,0,0.85)', color: 'white', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', py: '16px !important' }}>
                <Box textAlign="center"><AttachMoneyIcon sx={{ color: '#FFC107' }} /><Typography variant="h6" fontWeight="bold">0 F</Typography><Typography variant="caption" sx={{ opacity: 0.7 }}>Gains</Typography></Box>
                <Box sx={{ width: 1, height: 40, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box textAlign="center"><HistoryIcon sx={{ color: '#4CAF50' }} /><Typography variant="h6" fontWeight="bold">0</Typography><Typography variant="caption" sx={{ opacity: 0.7 }}>Courses</Typography></Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ==================================================================================
// 👤 INTERFACE PASSAGER (Standard)
// ==================================================================================
const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme(); 
  const isDark = theme.palette.mode === 'dark';
  const userLocation = useGeolocation();

  if (user?.role === 'driver') {
    return <DriverDashboard user={user} userLocation={userLocation} />;
  }

  // --- ÉTATS PASSAGER ---
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isWaitingForDriver, setIsWaitingForDriver] = useState(false);
  const [activeRide, setActiveRide] = useState(null); 
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const searchInputRef = useRef(null);
  const debouncedDest = useDebounce(destination, 500);
  const isSelecting = useRef(false);

  const [createRide, { isLoading: isCreating }] = useCreateRideMutation();
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { skip: !user });
  const unreadCount = useMemo(() => Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, [notifications]);

  useEffect(() => {
    if (debouncedDest.length > 2 && !isSelecting.current) {
      searchPlaces(debouncedDest).then(setSuggestions);
    } else {
      setSuggestions([]);
      isSelecting.current = false;
    }
  }, [debouncedDest]);

  // --- 👂 ORCHESTRATION SOCKET PASSAGER ---
  useEffect(() => {
    const handleRideAccepted = (ride) => {
      setIsWaitingForDriver(false);
      setActiveRide(ride);
      socketService.emit('joinRide', ride._id);
      dispatch(showToast({ message: 'Chauffeur en route ! 🚗', type: 'success' }));
    };

    const handleLocationUpdate = (coords) => {
      // Tracking silencieux pour l'instant
    };

    socketService.on('rideAccepted', handleRideAccepted);
    socketService.on('driverLocationUpdate', handleLocationUpdate);

    return () => {
      socketService.off('rideAccepted', handleRideAccepted);
      socketService.off('driverLocationUpdate', handleLocationUpdate);
    };
  }, [dispatch]);

  const handleSelectDestination = (place) => {
    isSelecting.current = true;
    setDestination(place.main_text);
    setSearchedLocation([place.lat, place.lon]);
    setSuggestions([]);
    setIsMapVisible(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) handleSelectDestination(suggestions[0]);
  };

  const handleCommanderClick = () => {
    if (selectedCategory && searchInputRef.current) {
      searchInputRef.current.focus();
      dispatch(showToast({ message: 'Quelle est votre destination ?', type: 'info' }));
    }
  };

  const handleClearSearch = () => {
    setDestination('');
    setSuggestions([]);
    setSearchedLocation(null);
    setIsMapVisible(false);
    setSelectedCategory(null);
    setActiveRide(null); 
  };

  const handleConfirmOrder = async () => {
    if (!searchedLocation || !selectedCategory) return;
    try {
      await createRide({
        pickupLocation: { 
          address: "Ma position", 
          coordinates: [userLocation.coordinates.lng, userLocation.coordinates.lat] 
        },
        dropoffLocation: { 
          address: destination, 
          coordinates: [searchedLocation[1], searchedLocation[0]] 
        },
        paymentMethod: 'cash',
        price: selectedCategory.price,
        category: selectedCategory.type
      }).unwrap();
      
      setIsWaitingForDriver(true); 
    } catch (err) {
      dispatch(showToast({ message: 'Erreur lors de la commande', type: 'error' }));
    }
  };

  const handleCancelSearch = () => setIsWaitingForDriver(false);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
      
      {!isMapVisible && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: isDark ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', zIndex: 0 }} />
      )}

      <RideSearchOverlay isVisible={isWaitingForDriver} onCancel={handleCancelSearch} />
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Box sx={{ p: 2, pt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <Box>
          <Typography variant="h4" fontWeight="900"><span style={{ color: '#FFC107' }}>Y</span><span style={{ color: isDark ? 'white' : 'black' }}>ély</span></Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>Salut, {user?.name?.split(' ')[0] || 'Voyageur'} 👋</Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: '12px' }}><Badge color="error" variant="dot" invisible={unreadCount === 0}><MenuIcon /></Badge></IconButton>
      </Box>

      {!activeRide && (
        <Box sx={{ px: 2, mb: 1, zIndex: 100, mt: isMapVisible ? 0 : 4 }}>
          <Paper sx={{ display: 'flex', alignItems: 'center', p: 0.8, px: 2, borderRadius: '16px', boxShadow: 4 }}>
            <SearchIcon sx={{ color: '#FFC107', mr: 1 }} />
            <InputBase inputRef={searchInputRef} placeholder="On va où ?" value={destination} onChange={(e) => setDestination(e.target.value)} onKeyDown={handleKeyDown} fullWidth sx={{ fontWeight: 600 }} />
            {destination && <IconButton size="small" onClick={handleClearSearch}><CloseIcon /></IconButton>}
          </Paper>
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'absolute', left: 16, right: 16, zIndex: 110 }}>
                <Paper sx={{ mt: 1, overflow: 'hidden', borderRadius: '16px', boxShadow: 5 }}>
                  {suggestions.map((p, i) => (
                    <Box key={i} onClick={() => handleSelectDestination(p)} sx={{ p: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,193,7,0.1)' }, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <Typography variant="body2" fontWeight="bold">{p.main_text}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.secondary_text}</Typography>
                    </Box>
                  ))}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 10 }}>
        {isMapVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', width: '100%', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
            <LeafletMap userLocation={userLocation} searchedLocation={searchedLocation} nearbyTaxis={[]} />
          </motion.div>
        )}
      </Box>

      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 150 }}>
        <AnimatePresence mode="wait">
          {activeRide ? (
            <DriverInfoCard key="driver-info" ride={activeRide} onCancel={() => {}} />
          ) : (
            <Box key="vehicle-selector" sx={{ 
              background: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)', borderTopLeftRadius: '30px', borderTopRightRadius: '30px',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.15)', padding: isMapVisible ? '10px 0 20px 0' : '20px 0',
              display: 'flex', flexDirection: 'column'
            }}>
              {!isMapVisible && (
                <Typography variant="subtitle1" fontWeight="900" sx={{ mb: 1, ml: 3, opacity: 0.8 }}>
                  {selectedCategory ? 'Forfait sélectionné' : 'Choisissez votre confort'}
                </Typography>
              )}
              <Box sx={{ mb: isMapVisible ? 1 : 2 }}>
                <VehicleCarousel onSelect={(service) => setSelectedCategory(service)} selectedId={selectedCategory?.id} />
              </Box>
              <Box sx={{ px: 2 }}>
                <AnimatePresence>
                  {selectedCategory && !isMapVisible && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <Button fullWidth variant="contained" onClick={handleCommanderClick} sx={{ bgcolor: '#FFC107', color: 'black', borderRadius: '16px', py: 1.5, fontWeight: '900', fontSize: '1rem' }}>
                        COMMANDER YÉLY {selectedCategory.type}
                      </Button>
                    </motion.div>
                  )}
                  {isMapVisible && searchedLocation && selectedCategory && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Button fullWidth variant="contained" onClick={handleConfirmOrder} disabled={isCreating} sx={{ bgcolor: '#4CAF50', color: 'white', borderRadius: '16px', py: 1.5, fontWeight: '900', fontSize: '1rem', '&:hover': { bgcolor: '#45a049' } }}>
                        {isCreating ? <CircularProgress size={24} color="inherit" /> : `CONFIRMER LA COURSE (${selectedCategory.price} F)`}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default HomePage;