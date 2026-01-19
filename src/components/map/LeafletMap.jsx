// src/components/map/LeafletMap.jsx
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

// --- ICÔNES ---
const userIcon = new L.DivIcon({
  className: 'user-marker',
  html: `<div style="width: 22px; height: 22px; background: #2196F3; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(33, 150, 243, 0.8);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const destIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

const taxiIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/75/75780.png', 
  iconSize: [35, 35],
  iconAnchor: [17, 17]
});

// --- CERVEAU DU TRACÉ ---
const RouteController = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    // SÉCURITÉ : On ne bouge que si les coordonnées sont valides
    if (start && end && start[0] && end[0]) {
      const bounds = L.latLngBounds([start, end]);
      try {
        map.fitBounds(bounds, { 
          paddingTopLeft: [50, 50],
          paddingBottomRight: [50, 300], // J'ai réduit un peu (300) pour éviter les bugs sur petits écrans
          animate: true,
          duration: 1.5
        });
      } catch (e) {
        console.warn("Erreur fitBounds (ignorée) :", e);
      }
    }
  }, [start, end, map]);

  return null;
};

// --- STABILISATEUR ---
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const interval = setInterval(() => map.invalidateSize(), 100);
    return () => clearInterval(interval);
  }, [map]);
  return null;
};

const LeafletMap = ({ searchedLocation, userLocation, onTaxiClick, nearbyTaxis = [] }) => {
  
  // 1. CHARGEMENT
  if (!userLocation.loaded) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FFC107' }} />
        <Typography variant="caption" sx={{ mt: 1 }}>Acquisition GPS...</Typography>
      </Box>
    );
  }

  // 2. ERREUR GPS (IMPORTANT : Si on l'oublie, ça crash plus bas)
  if (userLocation.error) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="error" fontWeight="bold">Signal GPS Perdu</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>{userLocation.error.message}</Typography>
        <Button size="small" variant="outlined" onClick={() => window.location.reload()}>Réessayer</Button>
      </Box>
    );
  }

  // 3. PRÉPARATION DES POINTS (Sécurisée)
  const startPoint = useMemo(() => {
    if (userLocation.coordinates?.lat && userLocation.coordinates?.lng) {
      return [userLocation.coordinates.lat, userLocation.coordinates.lng];
    }
    return null; // Si pas de coords, on retourne null
  }, [userLocation]);

  const endPoint = useMemo(() => searchedLocation, [searchedLocation]);

  // Si le GPS a chargé mais qu'on a pas de point de départ valide, on attend
  if (!startPoint) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption">Position indisponible</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer 
        center={startPoint} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <MapResizer />
        
        {/* On n'affiche le trajet que si TOUT est là */}
        {endPoint && <RouteController start={startPoint} end={endPoint} />}

        {endPoint && (
          <Polyline 
            positions={[startPoint, endPoint]} 
            pathOptions={{ color: 'black', weight: 4, dashArray: '10, 10', opacity: 0.7 }} 
          />
        )}

        <Marker position={startPoint} icon={userIcon}>
          <Popup>Départ</Popup>
        </Marker>

        {endPoint && (
          <Marker position={endPoint} icon={destIcon}>
            <Popup>Arrivée</Popup>
          </Marker>
        )}

        {endPoint && nearbyTaxis.map((taxi) => (
          <Marker 
            key={taxi.id} 
            position={[taxi.lat, taxi.lng]} 
            icon={taxiIcon}
            eventHandlers={{ click: () => onTaxiClick(taxi) }}
          />
        ))}
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;