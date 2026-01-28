// kevyamon/yely_frontend/src/features/subscription/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// L'URL de base (Vite proxy ou variable d'env)
const API_URL = '/api/subscription';

// --- ACTION : ENVOYER LA PREUVE ---
// C'est notre "coursier" qui prend le paquet (formData) et l'amène au serveur
export const submitSubscriptionProof = createAsyncThunk(
  'subscription/submitProof',
  async (formData, thunkAPI) => {
    try {
      // 1. On récupère le badge d'accès (Token) du chauffeur connecté
      const token = thunkAPI.getState().auth.userInfo.token;

      // 2. On prépare l'envoi
      // NOTE IMPORTANTE : Avec FormData (fichier), on ne met PAS 'Content-Type': 'application/json'
      // Le navigateur le fait tout seul pour gérer l'image.
      const config = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      };

      const response = await fetch(`${API_URL}/submit-proof`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }

      return data;

    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    transaction: null, // La dernière transaction effectuée
    isLoading: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
      state.transaction = null;
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
        state.transaction = action.payload; // On garde la trace
      })
      .addCase(submitSubscriptionProof.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;