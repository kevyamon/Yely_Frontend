import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL de base
const API_URL = '/api/payments';

// 1. ACTION : PAYER L'ABONNEMENT
export const paySubscription = createAsyncThunk(
  'subscription/pay',
  async ({ plan, paymentMethod }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // On envoie la demande au backend
      const response = await axios.post(`${API_URL}/subscribe`, { plan, paymentMethod }, config);
      return response.data; // Retourne la confirmation et la nouvelle date d'expiration

    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    isLoading: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(paySubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(paySubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        
        // ASTUCE : On met à jour l'utilisateur dans le LocalStorage pour débloquer l'app immédiatement
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          currentUser.subscription = action.payload.subscription;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      })
      .addCase(paySubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;