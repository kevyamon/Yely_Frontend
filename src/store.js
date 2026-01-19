// src/store.js
import { configureStore } from '@reduxjs/toolkit';

// ATTENTION : On utilise './' car le fichier est à la racine de src/
import { apiSlice } from './features/api/apiSlice';
import authReducer from './features/auth/authSlice';
import themeReducer from './features/theme/themeSlice';
import subscriptionReducer from './features/subscription/subscriptionSlice';
import uiReducer from './features/common/uiSlice'; 

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    theme: themeReducer,
    subscription: subscriptionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});