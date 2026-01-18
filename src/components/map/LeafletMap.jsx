// src/components/map/LeafletMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet';
import { Box, useTheme, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icônes MUI
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';

// --- CONFIGURATION MAFÉRÉ ---
const MAFERE_COORDS = [5.4167, -3.2833];

// ⚠️ ICI : METTRE L'URL DE TON IMAGE DE MAFÉRÉ (Plus tard)
// Pour l'instant c'est vide, mais le code est prêt à l'afficher.
const MAFERE_OVERLAY_IMAGE = null; // ex: '/assets/maps/mafere_plan.png'
const MAFERE_BOUNDS = [[5.40, -3.30], [5.43, -3.26]]; // Les coins de l'image (Lat/Lon)

// --- 1. MARQUEURS CUSTOM ---
const createYelyIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: #FFC107; width: 20px; height: 20px; 
        border-radius: 50%; border: 3px solid white; 
        box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.4); position: relative;
      ">
        <div style="
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 60px; height: 60px; background: rgba(255, 193, 7, 0.3);
          border-radius: 50%; animation: pulse 2s infinite; z-index: -1;
        "></div>
      </div>`,
    iconSize: [20, 20], iconAnchor: [10, 10],
  });
};

const createDestinationIcon = () => {
  return L.divIcon({
    className: 'dest-marker',
    html: `
      <div style="position: relative; width: 40px; height: 40px; display: flex; justify-content: center;">
        <svg viewBox="0 0 24 24" fill="#f44336" style="width: 40px; height: 40px; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.4));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40]
  });
};

// --- CONTROLLER ---
const MapController = ({ zoomInTrigger, zoomOutTrigger, flyToUserTrigger, position, destination }) => {
  const map = useMap();

  useEffect(() => { if (zoomInTrigger > 0) map.zoomIn(); }, [zoomInTrigger, map]);
  useEffect(() => { if (zoomOutTrigger > 0) map.zoomOut(); }, [zoomOutTrigger, map]);

  // Vol vers l'utilisateur
  useEffect(() => {
    if (flyToUserTrigger > 0 && position) {
      map.flyTo(position, 17, { duration: 1.5 });
    }
  }, [flyToUserTrigger, position, map]);

  // Vol vers destination
  useEffect(() => {
    if (destination) {
      map.flyTo(destination, 16, { duration: 2.0 });
    }
  }, [destination, map]);

  return null;
};

// --- COMPOSANT PRINCIPAL ---
const LeafletMap = ({ searchedLocation }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [position, setPosition] = useState(null);
  
  // Compteurs
  const [zoomInCount, setZoomInCount] = useState(0);
  const [zoomOutCount, setZoomOutCount] = useState(0);
  const [flyToUserCount, setFlyToUserCount] = useState(0);
  
  // États UI
  const [openModal, setOpenModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false); // <--- NOUVEAU : Chargement en cours

  // FONCTION : LOCALISER L'UTILISATEUR
  const locateUser = (isManualClick = false) => {
    if (!navigator.geolocation) {
      if (isManualClick) alert("Votre appareil n'a pas de GPS.");
      setPosition(MAFERE_COORDS);
      return;
    }

    // Si manuel, on active le spinner
    if (isManualClick) setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        
        if (isManualClick) {
          setFlyToUserCount(prev => prev + 1);
          setIsLocating(false); // <--- STOP le spinner
        }
      },
      (err) => {
        console.warn("Erreur GPS:", err);
        if (isManualClick) {
          setOpenModal(true);
          setIsLocating(false); // <--- STOP le spinner même si erreur
        } else {
          setPosition(MAFERE_COORDS);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => { locateUser(false); }, []);

  // CSS Pulse
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes pulse { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; } }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!position) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: isDark ? '#111' : '#eee' }}><CircularProgress sx={{ color: '#FFC107' }} /></Box>;
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      
      <MapContainer 
        center={position} zoom={15} zoomControl={false} attributionControl={false}
        style={{ height: '100%', width: '100%', background: isDark ? '#000' : '#ddd' }}
      >
        <TileLayer url={isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'} />

        {/* --- LE FUTUR CALQUE DE MAFÉRÉ (IMAGE STATIQUE) --- */}
        {/* Dès que tu as l'image, tu mets l'URL en haut et ça s'affiche ici */}
        {MAFERE_OVERLAY_IMAGE && (
          <ImageOverlay
            url={MAFERE_OVERLAY_IMAGE}
            bounds={MAFERE_BOUNDS}
            opacity={0.8}
            zIndex={10}
          />
        )}

        <Marker position={position} icon={createYelyIcon()}>
          <Popup>Vous êtes ici</Popup>
        </Marker>

        {searchedLocation && (
          <Marker position={searchedLocation} icon={createDestinationIcon()}>
            <Popup>Destination 🏁</Popup>
          </Marker>
        )}

        <MapController 
          zoomInTrigger={zoomInCount} 
          zoomOutTrigger={zoomOutCount} 
          flyToUserTrigger={flyToUserCount} 
          position={position}
          destination={searchedLocation}
        />
      </MapContainer>

      {/* CONTRÔLES FLOTTANTS */}
      <Box sx={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 1000 }}>
        
        {/* BOUTON CIBLE AVEC CHARGEMENT INTÉGRÉ 🔄 */}
        <IconButton 
          onClick={() => locateUser(true)} 
          disabled={isLocating} // Désactive le clic pendant le chargement
          sx={{ 
            bgcolor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)', 
            backdropFilter: 'blur(10px)', 
            color: '#FFC107', 
            border: '1px solid rgba(255,255,255,0.1)',
            width: 40, height: 40,
            '&:hover': { bgcolor: '#FFC107', color: 'black' }
          }}
        >
          {isLocating ? (
            <CircularProgress size={20} sx={{ color: '#FFC107' }} />
          ) : (
            <MyLocationIcon />
          )}
        </IconButton>

        {/* ZOOM */}
        <Box sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '50px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
          <IconButton onClick={() => setZoomInCount(prev => prev + 1)} sx={{ color: isDark ? 'white' : 'black' }}><AddIcon /></IconButton>
          <IconButton onClick={() => setZoomOutCount(prev => prev + 1)} sx={{ color: isDark ? 'white' : 'black' }}><RemoveIcon /></IconButton>
        </Box>
      </Box>

      {/* MODAL ALERTE GPS */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{ sx: { borderRadius: '20px', bgcolor: isDark ? '#1a1a1a' : 'white', color: isDark ? 'white' : 'black' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#f44336' }}>
          <LocationDisabledIcon /> Localisation impossible
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
            Nous n'arrivons pas à accéder à votre position. <br/><br/>
            Veuillez activer la localisation dans les paramètres de votre navigateur.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} sx={{ color: 'gray' }}>Fermer</Button>
          <Button onClick={() => { setOpenModal(false); locateUser(true); }} variant="contained" color="primary">Réessayer</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default LeafletMap;