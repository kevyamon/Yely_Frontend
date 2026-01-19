// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

const useGeolocation = () => {
  // État initial : Rien n'est chargé, aucune coordonnée par défaut
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null,
  });

  useEffect(() => {
    // 1. Vérification basique
    if (!("geolocation" in navigator)) {
      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: { code: 0, message: "Géolocalisation non supportée par ce navigateur" },
      });
      return;
    }

    // 2. Options pour forcer la précision
    const options = {
      enableHighAccuracy: true, // Demande le GPS matériel
      timeout: 20000,           // Attend 20s avant de dire "Erreur"
      maximumAge: 0,            // Refuse les positions en cache
    };

    const onSuccess = (pos) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        },
        error: null,
      });
    };

    const onError = (error) => {
      // Gère les cas où l'utilisateur refuse ou le GPS échoue
      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: {
          code: error.code,
          message: error.code === 1 
            ? "Permission refusée. Veuillez autoriser la localisation." 
            : "Signal GPS introuvable."
        },
      });
    };

    // 3. Déclenche la demande de permission IMMÉDIATEMENT
    const watcher = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return location;
};

export default useGeolocation;