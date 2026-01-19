// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null }, // Strictement null au départ
    error: null,
  });

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
    setLocation((prev) => ({
      ...prev,
      loaded: true,
      error: { code: error.code, message: error.message },
    }));
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({ code: 0, message: "Géolocalisation non supportée" });
      return;
    }

    const options = {
      enableHighAccuracy: true, // Précision maximale exigée
      timeout: 10000,
      maximumAge: 0,
    };

    // Surveillance constante sans émission de fausse donnée
    const watcher = navigator.geolocation.watchPosition(onSuccess, onError, options);
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return location;
};

export default useGeolocation;