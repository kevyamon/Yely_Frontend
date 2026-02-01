// src/pages/rider/RiderHome.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Box, Typography, IconButton, InputBase, Button, Badge, useTheme, 
  CircularProgress, Paper 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';

// Hooks & Services
import { searchPlaces } from '../../services/mapService';
import useDebounce from '../../hooks/useDebounce';
import { useGetNotificationsQuery } from '../../features/notifications/notificationsApiSlice';
import { useCreateRideMutation } from '../../features/rides/ridesApiSlice';
import { showToast } from '../../features/common/uiSlice';
import socketService from '../../services/socketService';

// Composants UI
import VehicleCarousel from '../../components/ui/VehicleCarousel'; 
import AppDrawer from '../../components/ui/AppDrawer'; 
import LeafletMap from '../../components/map/LeafletMap';
import RideSearchOverlay from '../../components/ui/RideSearchOverlay';
import DriverInfoCard from '../../components/ui/DriverInfoCard';

// Icônes
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const RiderHome = ({ user, userLocation }) => {
  const dispatch = useDispatch();
  const theme = useTheme(); 
  const isDark = theme.palette.mode === 'dark';

  // ÉTATS FLUX
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isWaitingForDriver, setIsWaitingForDriver] = useState(false); // Mode "Recherche Chauffeur"
  const [activeRide, setActiveRide] = useState(null); // Mode "En Course" (Accepté/En cours)
  
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

  // RECHERCHE DE LIEUX
  useEffect(() => {
    if (debouncedDest.length > 2 && !isSelecting.current) {
      searchPlaces(debouncedDest).then(setSuggestions);
    } else {
      setSuggestions([]);
      isSelecting.current = false;
    }
  }, [debouncedDest]);

  // --- 👂 ORCHESTRATION SOCKET (LE CŒUR DU SYSTÈME) ---
  useEffect(() => {
    // 1. CHAUFFEUR A ACCEPTÉ -> ON PASSE EN MODE TRACKING
    const handleRideAccepted = (ride) => {
      console.log("✅ COURSE ACCEPTÉE :", ride);
      setIsWaitingForDriver(false); // On cache l'overlay de recherche
      setActiveRide(ride); // On affiche la carte conducteur
      
      // On rejoint la room socket de la course pour recevoir les maj GPS du driver
      if(socketService.isConnected) {
          socketService.emit('joinRide', ride._id);
      }
      
      dispatch(showToast({ message: 'Chauffeur trouvé ! Il arrive. 🚗', type: 'success' }));
    };

    // 2. COURSE DÉMARRÉE (Client à bord)
    const handleRideStarted = (updatedRide) => {
      console.log("🚀 DÉMARRÉ :", updatedRide);
      setActiveRide(updatedRide); 
      dispatch(showToast({ message: 'Course démarrée ! Bonne route', type: 'info' }));
    };

    // 3. COURSE TERMINÉE
    const handleRideCompleted = (completedRide) => {
      console.log("🏁 TERMINÉ :", completedRide);
      setActiveRide(completedRide); 
      
      // Petit délai pour voir le résumé avant de reset
      setTimeout(() => {
        setActiveRide(null); 
        setDestination('');
        setSearchedLocation(null);
        setIsMapVisible(false);
        dispatch(showToast({ message: 'Vous êtes arrivé ! Merci ❤️', type: 'success' }));
      }, 4000);
    };

    // Abonnement aux événements
    socketService.on('rideAccepted', handleRideAccepted);
    socketService.on('rideStarted', handleRideStarted);    
    socketService.on('rideCompleted', handleRideCompleted); 

    // Nettoyage
    return () => {
      socketService.off('rideAccepted', handleRideAccepted);
      socketService.off('rideStarted', handleRideStarted);    
      socketService.off('rideCompleted', handleRideCompleted); 
    };
  }, [dispatch]);

  // --- ACTIONS UTILISATEUR ---

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
      
      // On passe en mode attente (Overlay Radar)
      setIsWaitingForDriver(true); 
    } catch (err) {
      dispatch(showToast({ message: 'Erreur lors de la commande', type: 'error' }));
    }
  };

  const handleCancelSearch = () => setIsWaitingForDriver(false);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
      
      {/* BACKGROUND ANIMÉ (Si pas de map) */}
      {!isMapVisible && !activeRide && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: isDark ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', zIndex: 0 }} />
      )}

      {/* OVERLAY DE RECHERCHE (RADAR) */}
      <RideSearchOverlay isVisible={isWaitingForDriver} onCancel={handleCancelSearch} />
      
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* HEADER PASSAGER */}
      <Box sx={{ p: 2, pt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <Box>
          <Typography variant="h4" fontWeight="900"><span style={{ color: '#FFC107' }}>Y</span><span style={{ color: isDark ? 'white' : 'black' }}>ély</span></Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>Salut, {user?.name?.split(' ')[0] || 'Voyageur'} 👋</Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: '12px' }}><Badge color="error" variant="dot" invisible={unreadCount === 0}><MenuIcon /></Badge></IconButton>
      </Box>

      {/* BARRE DE RECHERCHE (Masquée si course active) */}
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

      {/* CARTE */}
      <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 10 }}>
        {(isMapVisible || activeRide) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', width: '100%', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
            <LeafletMap 
                userLocation={userLocation} 
                searchedLocation={searchedLocation} 
                // Si on a une course active, on peut passer le driverLocation ici plus tard
                nearbyTaxis={[]} 
            />
          </motion.div>
        )}
      </Box>

      {/* TIROIR BAS (CHANGEMENT DYNAMIQUE) */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 150 }}>
        <AnimatePresence mode="wait">
          {activeRide ? (
            // CAS 1 : COURSE ACTIVE -> Infos du chauffeur
            <DriverInfoCard key="driver-info" ride={activeRide} onCancel={() => {}} />
          ) : (
            // CAS 2 : CHOIX VÉHICULE
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

export default RiderHome;