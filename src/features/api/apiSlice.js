// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// C'est le coeur du système RTK Query
export const apiSlice = createApi({
  reducerPath: 'api', // Nom dans le store
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api', // Proxy configuré dans vite.config.js
    prepareHeaders: (headers, { getState }) => {
      // Injection automatique du Token s'il existe
      const token = getState().auth.user?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notification', 'User'], // Pour le cache automatique
  endpoints: (builder) => ({}), // On injectera les endpoints depuis les autres fichiers
});