// src/hooks/useGeolocation.js
import { useState, useEffect, useRef } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null,
  });

  // Mémoire tampon pour éviter les mises à jour inutiles si la position ne change pas
  const locationRef = useRef({ lat: null, lng: null });

  useEffect(() => {
    // 1. Vérification du support navigateur
    if (!("geolocation" in navigator)) {
      setLocation(prev => ({ 
        ...prev, 
        loaded: true, 
        error: { code: 0, message: "Géolocalisation non supportée par cet appareil" } 
      }));
      return;
    }

    const onSuccess = (pos) => {
      const newLat = pos.coords.latitude;
      const newLng = pos.coords.longitude;

      // 2. Filtre de stabilité : On ne met à jour React que si la position change vraiment
      if (newLat !== locationRef.current.lat || newLng !== locationRef.current.lng) {
        locationRef.current = { lat: newLat, lng: newLng };
        
        setLocation({
          loaded: true,
          coordinates: { lat: newLat, lng: newLng },
          error: null,
        });
      }
    };

    const onError = (error) => {
      setLocation(prev => ({
        ...prev,
        loaded: true,
        error: { 
          code: error.code, 
          message: error.code === 1 
            ? "Accès à la localisation refusé." 
            : "Signal GPS introuvable." 
        },
      }));
    };

    // 3. Configuration Optimale
    const options = {
      enableHighAccuracy: true, // Demande le GPS matériel sur mobile
      timeout: 20000,           // 20 secondes max pour trouver
      maximumAge: 0,            // Pas de cache, on veut du temps réel
    };

    const watcher = navigator.geolocation.watchPosition(onSuccess, onError, options);

    // Nettoyage à la fermeture
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return location;
};

export default useGeolocation;