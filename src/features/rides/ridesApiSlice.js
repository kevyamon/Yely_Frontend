// src/features/rides/ridesApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const ridesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Historique
    getRideHistory: builder.query({
      query: () => ({
        url: '/rides/history',
        method: 'GET',
      }),
      providesTags: ['Ride'],
      keepUnusedDataFor: 5,
    }),

    // 2. Créer (Client)
    createRide: builder.mutation({
      query: (rideData) => ({
        url: '/rides',
        method: 'POST',
        body: rideData,
      }),
      invalidatesTags: ['Ride'],
    }),

    // 3. Accepter (Driver)
    acceptRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ride'],
    }),

    // 4. Démarrer (Driver)
    startRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/start`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ride'],
    }),

    // 5. Terminer (Driver)
    completeRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/complete`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ride'],
    }),

    // 6. Annuler (Client/Driver) - NOUVEAU
    cancelRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ride'],
    }),

  }),
});

export const { 
  useGetRideHistoryQuery,
  useCreateRideMutation,
  useAcceptRideMutation,
  useStartRideMutation,
  useCompleteRideMutation,
  useCancelRideMutation // <--- Exporté !
} = ridesApiSlice;