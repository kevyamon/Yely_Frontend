// src/components/map/LeafletMap.jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, IconButton, Stack, CircularProgress, Typography, Button } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// --- ICÔNES ---
const userIcon = new L.DivIcon({
  className: 'user-marker',
  html: `<div style="width: 22px; height: 22px; background: #2196F3; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(33, 150, 243, 0.8);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const taxiIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/75/75780.png', 
  iconSize: [35, 35],
  iconAnchor: [17, 17]
});

// --- STABILISATEUR ---
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const interval = setInterval(() => map.invalidateSize(), 100);
    return () => clearInterval(interval);
  }, [map]);
  return null;
};

// --- CONTRÔLEUR ---
const MapController = ({ searchedLocation, userCoords, isSearchCleared }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  // Centrage INITIAL strict
  useEffect(() => {
    if (userCoords.lat && !hasCentered.current) {
      map.setView([userCoords.lat, userCoords.lng], 16);
      hasCentered.current = true;
    }
  }, [userCoords, map]);

  // Réaction à la recherche
  useEffect(() => {
    if (searchedLocation) {
      map.flyTo(searchedLocation, 16, { animate: true, duration: 1.5 });
    } else if (isSearchCleared && userCoords.lat) {
      map.flyTo([userCoords.lat, userCoords.lng], 16, { animate: true, duration: 1.5 });
    }
  }, [searchedLocation, isSearchCleared, userCoords, map]);

  return (
    <Box sx={{ position: 'absolute', right: 15, bottom: 90, zIndex: 1000 }}>
      <Stack spacing={1.5}>
        <IconButton 
          onClick={() => userCoords.lat && map.flyTo([userCoords.lat, userCoords.lng], 17)}
          sx={{ bgcolor: 'white', color: '#2196F3', boxShadow: 3 }}
        >
          <MyLocationIcon />
        </IconButton>
        <IconButton onClick={() => map.zoomIn()} sx={{ bgcolor: 'white', color: 'black', boxShadow: 3 }}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={() => map.zoomOut()} sx={{ bgcolor: 'white', color: 'black', boxShadow: 3 }}>
          <RemoveIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

const LeafletMap = ({ searchedLocation, userLocation, onTaxiClick, nearbyTaxis = [], isSearchCleared }) => {
  
  // 1. ÉTAT DE CHARGEMENT : Si on n'a pas encore la réponse du navigateur
  if (!userLocation.loaded) {
    return (
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
        <CircularProgress size={40} sx={{ mb: 2, color: '#FFC107' }} />
        <Typography variant="body2" fontWeight="bold" color="text.secondary">
          Localisation en cours...
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Veuillez autoriser l'accès GPS
        </Typography>
      </Box>
    );
  }

  // 2. ÉTAT D'ERREUR : Si l'utilisateur a refusé ou si le GPS est HS
  if (userLocation.error) {
    return (
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#ffebee', p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>📍 Position introuvable</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {userLocation.error.message}
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Box>
    );
  }

  // 3. LA CARTE (N'existe QUE si on a les coordonnées)
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer 
        // On centre directement sur la VRAIE position
        center={[userLocation.coordinates.lat, userLocation.coordinates.lng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; Yély'
        />
        
        <MapResizer />

        <MapController 
          searchedLocation={searchedLocation} 
          userCoords={userLocation.coordinates} 
          isSearchCleared={isSearchCleared}
        />

        <Marker position={[userLocation.coordinates.lat, userLocation.coordinates.lng]} icon={userIcon}>
          <Popup>Vous êtes ici</Popup>
        </Marker>

        {searchedLocation && nearbyTaxis.map((taxi) => (
          <Marker 
            key={taxi.id} 
            position={[taxi.lat, taxi.lng]} 
            icon={taxiIcon}
            eventHandlers={{ click: () => onTaxiClick(taxi) }}
          />
        ))}

        {searchedLocation && <Marker position={searchedLocation} />}
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;