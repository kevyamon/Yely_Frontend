// src/features/rides/ridesApiSlice.js
import { apiSlice } from '../api/apiSlice'; // ✅ CORRECTION : Chemin exact (voisin)

export const ridesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Historique des courses
    getRideHistory: builder.query({
      query: () => ({
        url: '/rides/history',
        method: 'GET',
      }),
      providesTags: ['Ride'],
      keepUnusedDataFor: 5,
    }),

    // 2. Créer une course (Passager)
    createRide: builder.mutation({
      query: (rideData) => ({
        url: '/rides',
        method: 'POST',
        body: rideData,
      }),
      invalidatesTags: ['Ride'],
    }),

    // 3. Accepter une course (Chauffeur)
    acceptRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ride'],
    }),

    // 4. Démarrer la course - Client à bord (Chauffeur)
    startRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/start`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ride'],
    }),

    // 5. Terminer la course (Chauffeur)
    completeRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/complete`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ride'],
    }),
  }),
});

// EXPORT DES HOOKS (Indispensable pour HomePage)
export const { 
  useGetRideHistoryQuery,
  useCreateRideMutation,
  useAcceptRideMutation,
  useStartRideMutation,
  useCompleteRideMutation
} = ridesApiSlice;