// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import subscriptionReducer from '../features/subscription/subscriptionSlice';
import uiReducer from '../features/common/uiSlice'; // <--- IMPORT

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    theme: themeReducer,
    subscription: subscriptionReducer,
    ui: uiReducer, // <--- AJOUT
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});