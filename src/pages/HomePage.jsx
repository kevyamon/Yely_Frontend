// src/pages/HomePage.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Box, Typography, IconButton, InputBase, Button, Badge, useTheme, 
  CircularProgress, Modal, Fade, Avatar, Rating, Divider, Stack, Paper 
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

// Composants
import VehicleCarousel from '../components/ui/VehicleCarousel'; 
import AppDrawer from '../components/ui/AppDrawer'; 
import LeafletMap from '../components/map/LeafletMap';

// Icônes
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme(); 
  const isDark = theme.palette.mode === 'dark';
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- LOGIQUE RECHERCHE ---
  const userLocation = useGeolocation();
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const isSelecting = useRef(false); // Bloque le fetch après sélection

  const [createRide, { isLoading: isCreating }] = useCreateRideMutation();
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { skip: !user });
  const unreadCount = useMemo(() => Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, [notifications]);

  const debouncedDest = useDebounce(destination, 500);

  useEffect(() => {
    if (debouncedDest.length > 2 && !isSelecting.current) {
      searchPlaces(debouncedDest).then(setSuggestions);
    } else {
      setSuggestions([]);
      isSelecting.current = false; // Reset pour la prochaine frappe
    }
  }, [debouncedDest]);

  // Simulation taxis (Seulement si destination choisie)
  const nearbyTaxis = useMemo(() => {
    if (!userLocation.loaded || !searchedLocation) return [];
    const { lat, lng } = userLocation.coordinates;
    return [
      { id: 1, name: "Bati clean", plate: "12565UT", color: "Saloni", lat: lat + 0.0015, lng: lng + 0.001, price: 1500 },
      { id: 2, name: "Sassan Express", plate: "4589 HK 01", color: "Jaune", lat: lat - 0.001, lng: lng + 0.0015, price: 2000 }
    ];
  }, [userLocation, searchedLocation]);

  const handleSelectDestination = (place) => {
    isSelecting.current = true;
    setDestination(place.main_text);
    setSearchedLocation([place.lat, place.lon]);
    setSuggestions([]);
  };

  const handleClearSearch = () => {
    setDestination('');
    setSuggestions([]);
    setSearchedLocation(null); // Fix : Retour automatique à ma position
  };

  const handleTaxiClick = (taxi) => {
    if (!searchedLocation) {
      dispatch(showToast({ message: "Veuillez d'abord choisir une destination", type: "warning" }));
      document.getElementById('dest-input').focus();
      return;
    }
    setSelectedTaxi(taxi);
  };

  const handleConfirmOrder = async () => {
    if (!selectedTaxi) return;
    try {
      setSelectedTaxi(null);
      dispatch(showToast({ message: 'Commande envoyée au chauffeur !', type: 'success' }));
      await createRide({
        pickupLocation: { address: "Ma position actuelle", coordinates: [userLocation.coordinates.lng, userLocation.coordinates.lat] },
        dropoffLocation: { address: destination, coordinates: [searchedLocation[1], searchedLocation[0]] },
        paymentMethod: 'cash',
        price: selectedTaxi.price
      }).unwrap();
      navigate('/history');
    } catch (err) {
      dispatch(showToast({ message: 'Erreur lors de la commande', type: 'error' }));
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
      
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* --- HEADER --- */}
      <Box sx={{ p: 2, pt: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <Box>
          {/* Fix : Y jaune, reste noir/blanc */}
          <Typography variant="h4" fontWeight="900" sx={{ lineHeight: 1 }}>
            <span style={{ color: '#FFC107' }}>Y</span>
            <span style={{ color: isDark ? 'white' : 'black' }}>ély</span>
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="text.secondary">Salut, {user?.name?.split(' ')[0] || 'Bati'} 👋</Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ bgcolor: 'background.paper', boxShadow: 2, borderRadius: '12px' }}>
          <Badge color="error" variant="dot" invisible={unreadCount === 0}><MenuIcon /></Badge>
        </IconButton>
      </Box>

      {/* --- RECHERCHE --- */}
      <Box sx={{ px: 2, mb: 2, zIndex: 10 }}>
        <Paper sx={{ display: 'flex', alignItems: 'center', p: 1, px: 2, borderRadius: '16px', boxShadow: 3 }}>
          <SearchIcon sx={{ color: '#FFC107', mr: 1 }} />
          <InputBase
            id="dest-input"
            placeholder="On va où ?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && suggestions.length > 0) handleSelectDestination(suggestions[0]); }}
            fullWidth
            sx={{ fontSize: '1.1rem', fontWeight: 600 }}
          />
          {destination && <IconButton size="small" onClick={handleClearSearch}><CloseIcon fontSize="small" /></IconButton>}
        </Paper>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', left: 16, right: 16, zIndex: 20 }}>
              <Paper sx={{ mt: 1, overflow: 'hidden', borderRadius: '16px', background: isDark ? 'rgba(30,30,30,0.95)' : 'white' }}>
                {suggestions.map((p, i) => (
                  <Box key={i} onClick={() => handleSelectDestination(p)} sx={{ p: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,193,7,0.1)' } }}>
                    <Typography variant="body2" fontWeight="bold">{p.main_text}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.secondary_text}</Typography>
                  </Box>
                ))}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* --- CARTE --- */}
      <Box sx={{ flexGrow: 1, px: 2, mb: 2, zIndex: 5 }}>
        <Paper sx={{ height: '100%', width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: 4, border: '4px solid white' }}>
          <LeafletMap 
            userLocation={userLocation}
            searchedLocation={searchedLocation} 
            onTaxiClick={handleTaxiClick}
            nearbyTaxis={nearbyTaxis}
          />
        </Paper>
      </Box>

      {/* --- FORFAITS --- */}
      <Box sx={{ px: 2, pb: 3, zIndex: 10 }}>
          <Typography variant="h6" fontWeight="900" sx={{ mb: 1, ml: 1 }}>Choisis ton forfait</Typography>
          <VehicleCarousel />
      </Box>

      {/* --- MODAL CONFIRMATION --- */}
      <Modal open={!!selectedTaxi} onClose={() => setSelectedTaxi(null)} closeAfterTransition>
        <Fade in={!!selectedTaxi}>
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'background.paper', borderTopLeftRadius: 30, borderTopRightRadius: 30, p: 4, outline: 'none', boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}>
            <Box sx={{ width: 40, height: 4, bgcolor: 'grey.300', borderRadius: 2, mx: 'auto', mb: 3 }} />
            {selectedTaxi && (
              <>
                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Box>
                    <Typography variant="h5" fontWeight="900">{selectedTaxi.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedTaxi.plate}</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="900" color="primary">{selectedTaxi.price} F</Typography>
                </Box>
                <Stack direction="row" justifyContent="space-around" mb={4}>
                  <Box textAlign="center">
                    <AccessTimeFilledIcon color="action" />
                    <Typography variant="body2" fontWeight="bold">~4 min</Typography>
                    <Typography variant="caption" color="text.secondary">Retard possible</Typography>
                  </Box>
                  <Box textAlign="center">
                    <DirectionsCarIcon color="action" />
                    <Typography variant="body2" fontWeight="bold">Climatisé</Typography>
                  </Box>
                </Stack>
                <Button fullWidth variant="contained" size="large" onClick={handleConfirmOrder} disabled={isCreating} sx={{ bgcolor: '#FFC107', color: 'black', borderRadius: '16px', py: 2, fontSize: '1.2rem', fontWeight: '900' }}>
                  {isCreating ? <CircularProgress size={26} /> : 'COMMANDER MAINTENANT'}
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default HomePage;