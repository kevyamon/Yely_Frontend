// src/pages/HomePage.jsx
import React, { useState, useMemo } from 'react';
import { Box, Typography, IconButton, InputBase, Button, Badge, useTheme, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

// Services & Hooks
import { searchPlaces } from '../services/mapService';
import useDebounce from '../hooks/useDebounce';
// IMPORT CRUCIAL POUR LE BADGE
import { useGetNotificationsQuery } from '../features/notifications/notificationsApiSlice';

// Composants
import VehicleCarousel from '../components/ui/VehicleCarousel'; 
import AppDrawer from '../components/ui/AppDrawer'; 
import LeafletMap from '../components/map/LeafletMap';

// Icônes
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';

// --- FOND ANIMÉ ---
const LiquidBackground = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, bgcolor: theme.palette.background.default, overflow: 'hidden', transition: 'background-color 0.5s ease' }}>
      <motion.div
        animate={{ x: [-50, 50, -50], y: [-20, 20, -20], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '20%', left: '10%', width: '250px', height: '250px',
          background: isDark ? 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(255,193,7,0.25) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(50px)', borderRadius: '50%'
        }}
      />
    </Box>
  );
};

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme(); 
  const isDark = theme.palette.mode === 'dark';
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // --- ÉTATS RECHERCHE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);

  // --- GESTION INTELLIGENTE DU BADGE (HAMBURGER) ---
  // On écoute les notifications ici aussi pour savoir si on affiche le point rouge
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    skip: !user,
  });

  const unreadCount = useMemo(() => {
    return Array.isArray(notifications) 
      ? notifications.filter(n => !n.isRead).length 
      : 0;
  }, [notifications]);
  // -------------------------------------------------

  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  React.useEffect(() => {
    const doSearch = async () => {
      if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
        const results = await searchPlaces(debouncedSearchTerm);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };
    doSearch();
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSelectPlace = (place) => {
    setSearchQuery(place.main_text);
    setSuggestions([]);
    setSearchedLocation([place.lat, place.lon]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchedLocation(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <LiquidBackground />
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Box sx={{ position: 'relative', zIndex: 1, p: 2, pt: 6, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="900" sx={{ lineHeight: 1, letterSpacing: -1, mb: 0.5 }}>
              <span style={{ color: '#FFC107' }}>Y</span><span style={{ color: theme.palette.text.primary }}>ély</span>
            </Typography>
            <Typography variant="body1" fontWeight="500" sx={{ color: 'text.secondary' }}>
              Salut, {user ? user.name.split(' ')[0] : 'Kevy'} 👋
            </Typography>
          </Box>
          
          <IconButton 
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
              color: 'text.primary', 
              borderRadius: '12px' 
            }}
          >
            {/* C'EST ICI QUE LE BADGE DEVENAIT FOU - MAINTENANT IL EST SAGE */}
            <Badge 
              color="error" 
              variant="dot" 
              invisible={unreadCount === 0} // <--- IL DISPARAÎT SI 0 NOTIFS
            >
              <MenuIcon />
            </Badge>
          </IconButton>
        </Box>

        {/* BARRE DE RECHERCHE */}
        <Box mb={2} sx={{ position: 'relative', zIndex: 1002 }}> 
          <Box
            sx={{
              display: 'flex', alignItems: 'center',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '16px', p: 0.5, pl: 2,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: suggestions.length > 0 ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <SearchIcon sx={{ color: '#FFC107', mr: 1 }} />
            <InputBase
              placeholder="On va où ?"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ color: 'text.primary', fontSize: '1.1rem', fontWeight: 500 }}
            />
            {searchQuery && (
              <IconButton size="small" onClick={clearSearch} sx={{ color: 'text.secondary' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <Button variant="contained" sx={{ bgcolor: '#FFC107', color: 'black', borderRadius: '12px', minWidth: '40px', px: 2, fontWeight: 'bold', ml: 1 }}>
               GO
            </Button>
          </Box>

          {/* LISTE SUGGESTIONS */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute', top: '110%', left: 0, right: 0,
                  background: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px', overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <List dense sx={{ py: 0 }}>
                  {suggestions.map((place, index) => (
                    <React.Fragment key={place.place_id + index}>
                      <ListItemButton 
                        onClick={() => handleSelectPlace(place)}
                        sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <LocationOnIcon sx={{ color: '#FFC107' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography variant="body1" color="text.primary" fontWeight="bold">{place.main_text}</Typography>}
                          secondary={<Typography variant="caption" color="text.secondary" noWrap>{place.secondary_text}</Typography>}
                        />
                      </ListItemButton>
                    </React.Fragment>
                  ))}
                </List>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* CARTE */}
        <Box sx={{ 
          flexGrow: 1, position: 'relative', width: '100%', mb: 2, 
          borderRadius: '24px', overflow: 'hidden', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
        }}>
            <LeafletMap searchedLocation={searchedLocation} />
        </Box>

        {/* CARROUSEL */}
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, ml: 1 }}>
                Choisissez votre confort
            </Typography>
            <VehicleCarousel />
        </Box>

      </Box>
    </Box>
  );
};

export default HomePage;