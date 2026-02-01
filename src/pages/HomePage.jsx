// src/pages/HomePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import useGeolocation from '../hooks/useGeolocation';

// Import des modules séparés
import DriverHome from './driver/DriverHome';
import RiderHome from './rider/RiderHome';

const HomePage = () => {
  // 1. Récupération des données globales
  const { user } = useSelector((state) => state.auth);
  
  // 2. Géolocalisation centrale (utilisée par tout le monde)
  const userLocation = useGeolocation();

  // 3. Aiguillage intelligent
  // Si c'est un chauffeur, on charge le Dashboard Chauffeur
  if (user?.role === 'driver') {
    return <DriverHome user={user} userLocation={userLocation} />;
  }

  // Sinon, par défaut (user ou rider), on charge l'interface Passager
  return <RiderHome user={user} userLocation={userLocation} />;
};

export default HomePage;