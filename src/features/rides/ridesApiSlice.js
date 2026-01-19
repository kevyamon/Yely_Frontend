// src/features/rides/ridesApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const ridesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Récupérer l'historique
    getRideHistory: builder.query({
      query: () => ({
        url: '/rides/history',
        method: 'GET',
      }),
      providesTags: ['Ride'],
      keepUnusedDataFor: 5,
    }),

    // 2. Créer une course (NOUVEAU)
    createRide: builder.mutation({
      query: (rideData) => ({
        url: '/rides',
        method: 'POST',
        body: rideData,
      }),
      // Invalider le cache 'Ride' pour que l'historique se mette à jour tout seul
      invalidatesTags: ['Ride'],
    }),
  }),
});

export const { 
  useGetRideHistoryQuery,
  useCreateRideMutation // <--- On exporte le nouveau hook
} = ridesApiSlice;