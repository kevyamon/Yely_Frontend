import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import socketService from './services/socketService';
import { useAcceptRideMutation } from './features/rides/ridesApiSlice'; 
import { showToast } from './features/common/uiSlice';

import AppToast from './components/ui/AppToast'; 
import DriverRequestModal from './components/ui/DriverRequestModal';

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

  // --- LOGIQUE SOCKET ---
  useEffect(() => {
    if (user && user.token) {
      socketService.connect(user.token);

      // 🔴 SUPPRESSION : On ne force plus le joinZone('drivers') ici.
      // C'est le Switch dans HomePage qui décidera.

      // Écoute des nouvelles courses
      socketService.on('newRideAvailable', (rideData) => {
        // Gardien de sécurité (Double vérification)
        if (user.role === 'driver') {
           console.log("🔔 ALERTE CHAUFFEUR REÇUE :", rideData);
           setIncomingRide(rideData); 
        }
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  // --- ACTION : ACCEPTER ---
  const handleAcceptRide = async () => {
    if (!incomingRide) return;
    try {
      await acceptRide(incomingRide._id).unwrap();
      setIncomingRide(null);
      dispatch(showToast({ message: 'Course acceptée ! Navigation lancée 🚀', type: 'success' }));
    } catch (error) {
      console.error("Erreur acceptation:", error);
      dispatch(showToast({ message: 'Trop tard ! Course déjà prise.', type: 'error' }));
      setIncomingRide(null);
    }
  };

  const handleDeclineRide = () => {
    setIncomingRide(null);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode,
      primary: { main: '#FFC107' },
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
      <DriverRequestModal 
        open={!!incomingRide} 
        request={incomingRide} 
        onAccept={handleAcceptRide}
        onDecline={handleDeclineRide}
      />
      <BrowserRouter>
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;