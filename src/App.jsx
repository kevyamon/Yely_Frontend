import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux'; // Pour écouter le mode
import { useMemo } from 'react';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  // On récupère le mode actuel (light ou dark)
  const { mode } = useSelector((state) => state.theme);

  // Création du thème dynamique
  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#FFC107', // Jaune Yély (Reste le même)
      },
      background: {
        default: mode === 'dark' ? '#050505' : '#f4f6f8', // Noir profond vs Gris très clair
        paper: mode === 'dark' ? '#0a0a0a' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      }
    },
    typography: {
      fontFamily: 'sans-serif', // Ou ta police custom
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, textTransform: 'none', fontWeight: 'bold' },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS indispensable */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;