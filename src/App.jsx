// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// Import des Pages
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
  // On écoute le mode (light/dark) depuis le Redux Store
  const { mode } = useSelector((state) => state.theme);

  // Création dynamique du thème (S'adapte si tu changes le mode)
  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#FFC107', // Le Jaune Yély Iconique
      },
      background: {
        default: mode === 'dark' ? '#050505' : '#f4f6f8', // Noir Profond vs Gris très clair
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
        textTransform: 'none', // Garde la casse naturelle (Pas de TOUT MAJUSCULE)
        fontWeight: 'bold',
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Boutons arrondis modernes
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Enlève l'effet "grisâtre" par défaut de MUI en mode nuit
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS indispensable pour appliquer le fond noir/blanc */}
      <BrowserRouter>
        <Routes>
          {/* PAGE D'ACCUEIL (Publique) */}
          <Route path="/" element={<LandingPage />} />
          
          {/* AUTHENTIFICATION */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* APPLICATION (Privé) */}
          <Route path="/home" element={<HomePage />} />
          
          {/* ABONNEMENT (Le Mur) */}
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