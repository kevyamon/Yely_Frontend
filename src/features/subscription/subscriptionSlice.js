// kevyamon/yely_frontend/src/features/subscription/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// On s'assure d'utiliser la bonne URL Backend
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api/subscription`;

// --- 1. ENVOYER LA PREUVE ---
export const submitSubscriptionProof = createAsyncThunk(
  'subscription/submitProof',
  async (formData, thunkAPI) => {
    try {
      // CORRECTION ICI : On utilise .user et pas .userInfo
      const token = thunkAPI.getState().auth.user?.token;
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

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

// --- 2. VÉRIFIER LE STATUT (SILENCIEUX) ---
export const checkSubscriptionStatus = createAsyncThunk(
    'subscription/checkStatus',
    async (_, thunkAPI) => {
      try {
        // CORRECTION ICI AUSSI : .user au lieu de .userInfo
        const token = thunkAPI.getState().auth.user?.token;
        
        // Si pas de token, on retourne null calmement (pas d'erreur rouge)
        if (!token) return null; 
  
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // On interroge le profil utilisateur pour avoir le statut à jour
        const response = await axios.get(`${BACKEND_URL}/api/users/profile`, config);
        
        // On retourne l'objet subscription complet
        return response.data.subscription; 
  
      } catch (error) {
        // Si erreur silencieuse, on ne rejette pas forcément pour ne pas spammer la console
        // mais on peut le faire si on veut debuguer
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    isLoading: false,
    isSuccess: false,
    error: null,
    currentSubscription: null,
    lastTransaction: null,
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
      // Submit Proof
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
      // Check Status
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        // Si action.payload est null (non connecté), on ne fait rien
        if (action.payload) {
            state.currentSubscription = action.payload;
        }
      });
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;