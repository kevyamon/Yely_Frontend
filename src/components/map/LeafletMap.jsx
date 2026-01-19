// src/components/map/LeafletMap.jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, IconButton, Stack } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// --- ICÔNES ---
const userIcon = new L.DivIcon({
  className: 'user-marker',
  html: `<div style="width: 18px; height: 18px; background: #2196F3; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(33, 150, 243, 0.8);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const taxiIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/75/75780.png', 
  iconSize: [35, 35],
  iconAnchor: [17, 17]
});

// --- CERVEAU DE NAVIGATION (STABILITÉ ABSOLUE) ---
const MapController = ({ searchedLocation, userCoords, isSearchCleared }) => {
  const map = useMap();
  const hasInitiallyCentered = useRef(false);

  // 1. VERROU GPS INITIAL : On ne se cale sur l'utilisateur qu'une seule fois à l'arrivée du signal
  useEffect(() => {
    if (userCoords.lat && userCoords.lng && !hasInitiallyCentered.current) {
      map.setView([userCoords.lat, userCoords.lng], 16);
      hasInitiallyCentered.current = true; // Verrou activé : la carte ne bougera plus seule
    }
  }, [userCoords.lat, userCoords.lng, map]);

  // 2. MOUVEMENTS VOLONTAIRES : Recherche ou Reset
  useEffect(() => {
    if (searchedLocation) {
      map.flyTo(searchedLocation, 16, { animate: true });
    } else if (isSearchCleared && userCoords.lat) {
      map.flyTo([userCoords.lat, userCoords.lng], 16);
    }
  }, [searchedLocation, isSearchCleared, map, userCoords.lat, userCoords.lng]);

  return (
    <Box sx={{ position: 'absolute', right: 15, bottom: 25, zIndex: 1000 }}>
      <Stack spacing={1.5}>
        {/* BOUTON RETOUR MANUEL (Indépendant des re-renders) */}
        <IconButton 
          onClick={() => userCoords.lat && map.flyTo([userCoords.lat, userCoords.lng], 17)}
          sx={{ bgcolor: 'white', color: '#2196F3', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          <MyLocationIcon />
        </IconButton>
        
        <IconButton 
          onClick={() => map.zoomIn()} 
          sx={{ bgcolor: 'white', color: 'black', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
        >
          <AddIcon />
        </IconButton>
        
        <IconButton 
          onClick={() => map.zoomOut()} 
          sx={{ bgcolor: 'white', color: 'black', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
        >
          <RemoveIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

const LeafletMap = ({ searchedLocation, userLocation, onTaxiClick, nearbyTaxis = [], isSearchCleared }) => {
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer 
        center={[5.3484, -4.0305]} // Centre neutre (Cité Universitaire approximative)
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; Yély'
        />
        
        <MapController 
          searchedLocation={searchedLocation} 
          userCoords={userLocation.coordinates} 
          isSearchCleared={isSearchCleared}
        />

        {/* MARQUEUR UTILISATEUR RÉEL (Affiché seulement si lat existe) */}
        {userLocation.coordinates.lat && (
          <Marker position={[userLocation.coordinates.lat, userLocation.coordinates.lng]} icon={userIcon}>
            <Popup>Cité Universitaire (Toi)</Popup>
          </Marker>
        )}

        {/* TAXIS : Affichés seulement si une destination est active */}
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