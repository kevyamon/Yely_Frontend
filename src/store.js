// src/store.js
import { configureStore } from '@reduxjs/toolkit';

// Import des "cerveaux" (Slices)
import authReducer from './features/auth/authSlice';
import themeReducer from './features/theme/themeSlice';
import subscriptionReducer from './features/subscription/subscriptionSlice'; // <--- C'EST CETTE LIGNE QUI MANQUAIT !

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    subscription: subscriptionReducer, // Ici on l'utilise
  },
});