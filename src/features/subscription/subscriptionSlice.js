// src/features/subscription/subscriptionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api/subscription`;

// Action : Envoyer la preuve
export const submitSubscriptionProof = createAsyncThunk(
  'subscription/submitProof',
  async (formData, thunkAPI) => {
    try {
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

// Action : Vérifier le statut
export const checkSubscriptionStatus = createAsyncThunk(
    'subscription/checkStatus',
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user?.token;
        
        if (!token) return null; 

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
    isLoading: false,
    isSuccess: false,
    error: null,
    subscriptionStatus: 'inactive', // inactive, active
    subscriptionData: null,
    lastTransaction: null,
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
      // On ne reset pas lastTransaction tout de suite pour garder l'état pending affiché
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscriptionStatus = action.payload.status;
          state.subscriptionData = action.payload;
        }
      });
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;