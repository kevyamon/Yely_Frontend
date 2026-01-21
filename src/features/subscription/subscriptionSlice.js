// src/features/subscription/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// On utilise l'URL de base définie par Vite ou par défaut
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
const API_URL = `${BASE_URL}/payments`;

// 1. DÉMARRER LE PAIEMENT (Obtenir le lien Wave)
export const initPayment = createAsyncThunk(
  'subscription/init',
  async ({ plan }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post(`${API_URL}/init`, { plan }, config);
      return response.data; // { paymentUrl, transactionId, mode, amount }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. VÉRIFIER LE PAIEMENT (Confirmer auprès du Backend)
export const verifyPayment = createAsyncThunk(
  'subscription/verify',
  async ({ transactionId, plan }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post(`${API_URL}/verify`, { transactionId, plan }, config);
      return response.data; // { success: true, expiresAt: ... }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. VÉRIFIER LE STATUT (Le Vigile)
export const checkSubscriptionStatus = createAsyncThunk(
  'subscription/checkStatus',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // Si pas de token (pas connecté), on ne vérifie pas
      if (!token) return thunkAPI.rejectWithValue('No token');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/status`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    subscriptionStatus: null, // 'active' | 'inactive'
    paymentData: null, // Stocke l'ID de transaction temporaire
    message: '',
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.status = 'idle';
      state.message = '';
      state.paymentData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // INIT
      .addCase(initPayment.pending, (state) => { state.status = 'loading'; })
      .addCase(initPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paymentData = action.payload; // On garde les infos pour la suite
      })
      .addCase(initPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
      })
      // VERIFY
      .addCase(verifyPayment.pending, (state) => { state.status = 'loading'; })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subscriptionStatus = 'active'; // C'est bon, on débloque !
        
        // Mettre à jour le User en local pour éviter un refresh
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          currentUser.subscription = { ...currentUser.subscription, status: 'active', expiresAt: action.payload.expiresAt };
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
      })
      // CHECK STATUS
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        state.subscriptionStatus = action.payload.status;
      });
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;