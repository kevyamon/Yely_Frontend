// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import themeReducer from './features/theme/themeSlice';
import subscriptionReducer from './features/subscription/subscriptionSlice';
import { apiSlice } from './features/api/apiSlice'; // <--- IMPORT

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    subscription: subscriptionReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // <--- AJOUT REDUCER API
  },
  // <--- AJOUT MIDDLEWARE INDISPENSABLE POUR RTK QUERY
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});