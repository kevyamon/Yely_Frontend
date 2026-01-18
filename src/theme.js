// src/theme.js
import { createTheme } from '@mui/material/styles';

// On définit ici l'identité visuelle de Yély
const theme = createTheme({
  palette: {
    mode: 'light', // On pourra passer en 'dark' plus tard si tu veux
    primary: {
      main: '#FFC107', // Jaune Taxi/Yély (à ajuster selon ton logo)
      contrastText: '#000000', // Texte noir sur le jaune pour la lisibilité
    },
    secondary: {
      main: '#000000', // Noir profond pour les accents
    },
    background: {
      default: '#f5f5f5', // Gris très clair pour le fond (style mobile)
      paper: '#ffffff',   // Blanc pur pour les cartes/boutons
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // On mettra ta police "Uni" ici plus tard
    h1: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none', // Important : Évite que les boutons soient TOUT EN MAJUSCULES (plus moderne)
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // Arrondit les angles des boutons/cartes (style moderne iOS/Android)
  },
  components: {
    // Personnalisation globale des boutons
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 20px',
          boxShadow: 'none', // On préfère le flat design ou des ombres douces
        },
      },
    },
  },
});

export default theme;