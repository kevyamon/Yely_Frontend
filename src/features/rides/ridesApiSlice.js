// src/features/rides/ridesApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const ridesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRideHistory: builder.query({
      query: () => ({
        url: '/rides/history',
        method: 'GET',
      }),
      // Tag 'Ride' permet de rafraîchir la liste automatiquement si on ajoute une course plus tard
      providesTags: ['Ride'],
      // Garde les données en cache 5 secondes pour éviter de spammer le serveur
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetRideHistoryQuery } = ridesApiSlice;