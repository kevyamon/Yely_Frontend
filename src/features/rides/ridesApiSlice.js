import { apiSlice } from '../api/apiSlice';

export const ridesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Récupérer l'historique (Ton code existant)
    getRideHistory: builder.query({
      query: () => ({
        url: '/rides/history',
        method: 'GET',
      }),
      providesTags: ['Ride'],
      keepUnusedDataFor: 5,
    }),

    // 2. Créer une course (Ton code existant)
    createRide: builder.mutation({
      query: (rideData) => ({
        url: '/rides',
        method: 'POST',
        body: rideData,
      }),
      invalidatesTags: ['Ride'],
    }),

    // 3. Accepter une course (NOUVEAU - AJOUTÉ)
    acceptRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/accept`,
        method: 'PUT',
      }),
      // Invalider 'Ride' permet de rafraîchir l'historique automatiquement après avoir accepté
      invalidatesTags: ['Ride'],
    }),
  }),
});

export const { 
  useGetRideHistoryQuery,
  useCreateRideMutation,
  useAcceptRideMutation // <--- Export du nouveau hook
} = ridesApiSlice;