// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// --- IMPORT DU SYSTÈME DE NOTIFICATION GLOBAL ---
import AppToast from './components/ui/AppToast'; 
// ------------------------------------------------

// Import des Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage'; // Vérifie bien si c'est dans pages ou features/subscription
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import HistoryPage from './pages/HistoryPage';
import AccountPage from './pages/AccountPage';

function App() {
  // On écoute le mode (light/dark) depuis le Redux Store
  const { mode } = useSelector((state) => state.theme);

  // Création dynamique du thème
  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#FFC107', // Le Jaune Yély Iconique
      },
      background: {
        default: mode === 'dark' ? '#050505' : '#f4f6f8',
        paper: mode === 'dark' ? '#0a0a0a' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      }
    },
    typography: {
      fontFamily: 'sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 'bold',
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      
      {/* 🔥 LE TOAST GLOBAL EST POSÉ ICI : DISPONIBLE PARTOUT 🔥 */}
      <AppToast />
      
      <BrowserRouter>
        <Routes>
          {/* PAGE D'ACCUEIL (Publique) */}
          <Route path="/" element={<LandingPage />} />
          
          {/* AUTHENTIFICATION */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* APPLICATION (Privé) */}
          <Route path="/home" element={<HomePage />} />
          
          {/* ABONNEMENT */}
          <Route path="/subscription" element={<SubscriptionPage />} />

          {/* PAGES DU MENU LATÉRAL */}
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