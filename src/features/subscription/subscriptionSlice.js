// kevyamon/yely_frontend/src/features/subscription/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configuration de l'URL de base
// Si on est en dev (localhost), on utilise le proxy, sinon l'URL de prod
const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${BASE_URL}/api/subscription`;

// --- 1. L'ACTION PRINCIPALE : ENVOYER LA PREUVE (NOUVEAU) ---
export const submitSubscriptionProof = createAsyncThunk(
  'subscription/submitProof',
  async (formData, thunkAPI) => {
    try {
      // Récupération du token
      const token = thunkAPI.getState().auth.userInfo?.token;
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Crucial pour l'envoi d'image
        },
      };

      // On poste vers la nouvelle route qu'on a créée
      const response = await axios.post(`${API_URL}/submit-proof`, formData, config);
      return response.data;

    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- 2. LE VIGILE : VÉRIFIER LE STATUT (L'ANCIEN AMÉLIORÉ) ---
// Cette fonction sert à rafraîchir le statut de l'utilisateur pour voir si l'admin a validé
export const checkSubscriptionStatus = createAsyncThunk(
    'subscription/checkStatus',
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.userInfo?.token;
        if (!token) return thunkAPI.rejectWithValue('Non connecté');
  
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // On demande au backend : "C'est quoi mon statut actuel ?"
        // Note: On utilise souvent user profile pour ça, mais gardons la logique séparée si tu préfères
        const response = await axios.get(`${BASE_URL}/api/users/profile`, config);
        
        // On renvoie juste la partie abonnement
        return response.data.subscription; 
  
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    isLoading: false,
    isSuccess: false, // Vrai si l'envoi de la preuve a marché
    error: null,
    currentSubscription: null, // Stocke les infos de l'abo (active, date fin...)
    lastTransaction: null, // Pour garder une trace de ce qu'on vient d'envoyer
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
      state.lastTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CAS : ENVOI DE PREUVE ---
      .addCase(submitSubscriptionProof.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitSubscriptionProof.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lastTransaction = action.payload.transaction;
      })
      .addCase(submitSubscriptionProof.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- CAS : VÉRIFICATION DU STATUT ---
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      });
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;