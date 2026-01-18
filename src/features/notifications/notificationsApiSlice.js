// src/features/notifications/notificationsApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET : Récupérer les notifs (Polling possible ici)
    getNotifications: builder.query({
      query: () => '/notifications',
      // Transforme la réponse pour trier si besoin (backend le fait déjà mais sécurité)
      transformResponse: (res) => res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      providesTags: ['Notification'],
      // Polling : Rafraîchir toutes les 60 secondes auto (ou via Socket plus tard)
      pollingInterval: 60000, 
    }),

    // PUT : Marquer comme lu (Optimistic Update possible)
    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/mark-read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'], // Force le re-chargement des données fraîches
    }),

  }),
});

// Export des Hooks auto-générés pour l'UI
export const { useGetNotificationsQuery, useMarkAllAsReadMutation } = notificationsApiSlice;