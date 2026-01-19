// src/pages/HomePage.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Box, Typography, IconButton, InputBase, Button, Badge, useTheme, 
  CircularProgress, Paper, Stack 
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
import CloseIcon from '@mui/icons-material/Close';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme(); 
  const isDark = theme.palette.mode === 'dark';
  
  // ÉTATS DE L'INTERFACE
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  
  // GÉOLOCALISATION ET RECHERCHE
  const userLocation = useGeolocation();
  const debouncedDest = useDebounce(destination, 500);
  const isSelecting = useRef(false);

  // API
  const [createRide, { isLoading: isCreating }] = useCreateRideMutation();
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { skip: !user });
  
  const unreadCount = useMemo(() => 
    Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, 
    [notifications]
  );

  // TAILLES DYNAMIQUES
  const DRAWER_MIN_HEIGHT = '220px'; 
  const DRAWER_MAX_HEIGHT = '45vh';

  useEffect(() => {
    if (debouncedDest.length > 2 && !isSelecting.current) {
      searchPlaces(debouncedDest).then(setSuggestions);
    } else {
      setSuggestions([]);
      isSelecting.current = false;
    }
  }, [debouncedDest]);

  const handleSelectDestination = (place) => {
    isSelecting.current = true;
    setDestination(place.main_text);
    setSearchedLocation([place.lat, place.lon]);
    setSuggestions([]);
    setIsDrawerExpanded(true); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelectDestination(suggestions[0]);
    }
  };

  const handleClearSearch = () => {
    setDestination('');
    setSuggestions([]);
    setSearchedLocation(null);
    setIsDrawerExpanded(false);
    setSelectedCategory(null);
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
      
      dispatch(showToast({ message: `Recherche d'un chauffeur ${selectedCategory.type}...`, type: 'info' }));
      navigate('/history');
    } catch (err) {
      dispatch(showToast({ message: 'Erreur lors de la commande', type: 'error' }));
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* HEADER */}
      <Box sx={{ p: 2, pt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <Box>
          <Typography variant="h4" fontWeight="900">
            <span style={{ color: '#FFC107' }}>Y</span>
            <span style={{ color: isDark ? 'white' : 'black' }}>ély</span>
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            Salut, {user?.name?.split(' ')[0] || 'Voyageur'} 👋
          </Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: '12px' }}>
          <Badge color="error" variant="dot" invisible={unreadCount === 0}><MenuIcon /></Badge>
        </IconButton>
      </Box>

      {/* BARRE DE RECHERCHE */}
      <Box sx={{ px: 2, mb: 1, zIndex: 100 }}>
        <Paper sx={{ display: 'flex', alignItems: 'center', p: 0.8, px: 2, borderRadius: '16px', boxShadow: 4 }}>
          <SearchIcon sx={{ color: '#FFC107', mr: 1 }} />
          <InputBase
            placeholder="On va où ?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            sx={{ fontWeight: 600 }}
          />
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

      {/* CARTE */}
      <Box sx={{ 
        flexGrow: 1, 
        width: '100%',
        position: 'relative',
        zIndex: 10,
        pb: isDrawerExpanded ? DRAWER_MAX_HEIGHT : DRAWER_MIN_HEIGHT,
        transition: 'padding-bottom 0.5s ease'
      }}>
        <Box sx={{ height: '100%', width: '100%', p: 1 }}>
          <Paper sx={{ height: '100%', width: '100%', borderRadius: '24px', overflow: 'hidden', border: '3px solid white' }}>
            <LeafletMap 
              userLocation={userLocation}
              searchedLocation={searchedLocation} 
              nearbyTaxis={[]} 
            />
          </Paper>
        </Box>
      </Box>

      {/* TIROIR */}
      <motion.div 
        animate={{ height: isDrawerExpanded ? DRAWER_MAX_HEIGHT : DRAWER_MIN_HEIGHT }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, 
          background: isDark ? 'rgba(18,18,18,0.98)' : 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          borderTopLeftRadius: '30px', borderTopRightRadius: '30px',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.12)', 
          zIndex: 150,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ width: 40, height: 4, bgcolor: 'grey.300', borderRadius: 10, mx: 'auto', mb: 2 }} />
        
        <Typography variant="subtitle1" fontWeight="900" sx={{ mb: 1, ml: 1 }}>
          {isDrawerExpanded ? 'Sélectionnez un forfait' : 'Taxis à proximité'}
        </Typography>

        {/* Carousel */}
        <Box sx={{ width: '100%', overflow: 'hidden', mb: isDrawerExpanded ? 1 : 0 }}>
          <VehicleCarousel 
            onSelect={(service) => setSelectedCategory(service)} 
            selectedId={selectedCategory?.id} 
          />
        </Box>

        {/* BOUTON CORRIGÉ : Plus petit et police réduite */}
        <AnimatePresence>
          {selectedCategory && isDrawerExpanded && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleConfirmOrder}
                disabled={isCreating}
                sx={{ 
                  bgcolor: '#FFC107', 
                  color: 'black', 
                  borderRadius: '14px',    // Rayon réduit
                  py: 1.2,                 // Hauteur réduite (1.8 -> 1.2)
                  fontWeight: '900',
                  fontSize: '0.85rem',     // Police réduite (1rem -> 0.85rem)
                  mt: 0.5,
                  '&:hover': { bgcolor: '#FFD54F' }
                }}
              >
                {isCreating ? <CircularProgress size={20} color="inherit" /> : `COMMANDER YÉLY ${selectedCategory.type}`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Box>
  );
};

export default HomePage;