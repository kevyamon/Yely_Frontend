// src/App.jsx
import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import socketService from './services/socketService';
import { useAcceptRideMutation } from './features/rides/ridesApiSlice'; 
import { showToast } from './features/common/uiSlice';

import AppToast from './components/ui/AppToast'; 
import DriverRequestModal from './components/ui/DriverRequestModal';
import SubscriptionGuard from './components/auth/SubscriptionGuard'; // <--- LE NOUVEAU VIGILE

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage'; 
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import HistoryPage from './pages/HistoryPage';
import AccountPage from './pages/AccountPage';

function App() {
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth); 
  const dispatch = useDispatch();

  const [incomingRide, setIncomingRide] = useState(null);
  const [acceptRide] = useAcceptRideMutation(); 

  // --- LOGIQUE SOCKET (Talkie-Walkie) ---
  useEffect(() => {
    if (user && user.token) {
      socketService.connect(user.token);

      // Le chauffeur écoute s'il y a du travail
      socketService.on('newRideAvailable', (rideData) => {
        if (user.role === 'driver') {
           setIncomingRide(rideData); 
        }
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  // --- ACTION : ACCEPTER UNE COURSE ---
  const handleAcceptRide = async () => {
    if (!incomingRide) return;
    try {
      await acceptRide(incomingRide._id).unwrap();
      setIncomingRide(null);
      // Le succès est géré par l'événement socket 'rideAccepted' ailleurs
    } catch (error) {
      // Pas de console.error ici, le Toast suffit pour l'utilisateur
      dispatch(showToast({ message: 'Trop tard ! Course déjà prise.', type: 'error' }));
      setIncomingRide(null);
    }
  };

  const handleDeclineRide = () => {
    setIncomingRide(null);
  };

  // --- CONFIGURATION DU DESIGN (THÈME) ---
  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode,
      primary: { main: '#FFC107' }, // Jaune Yély
      background: {
        default: mode === 'dark' ? '#050505' : '#f4f6f8',
        paper: mode === 'dark' ? '#0a0a0a' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      }
    },
    typography: { fontFamily: 'sans-serif', button: { textTransform: 'none', fontWeight: 'bold' } },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <AppToast />
      
      {/* Modale qui s'affiche quand une course sonne */}
      <DriverRequestModal 
        open={!!incomingRide} 
        request={incomingRide} 
        onAccept={handleAcceptRide}
        onDecline={handleDeclineRide}
      />

      <BrowserRouter>
        {/* LE GARDIEN (<SubscriptionGuard>) ENTOURE TOUTES LES ROUTES 
            Il vérifie chaque changement de page. Si le chauffeur n'a pas payé, 
            le Gardien l'intercepte et l'envoie payer. 
        */}
        <SubscriptionGuard>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </SubscriptionGuard>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;