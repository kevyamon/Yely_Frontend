// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Utilisation de l'URL du .env ou fallback sur localhost
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api/users`;

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// FONCTION 1 : S'INSCRIRE
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    // --- AMÉLIORATION DE LA GESTION D'ERREUR ---
    let message;
    
    if (error.response && error.response.data && error.response.data.message) {
      // 1. Erreur renvoyée par notre Backend (ex: "Utilisateur existe déjà")
      message = error.response.data.message;
    } else if (error.message === "Network Error") {
      // 2. Erreur de connexion (Serveur éteint ou pas d'internet)
      message = "Impossible de contacter le serveur. Vérifiez votre connexion.";
    } else {
      // 3. Autre erreur technique
      message = error.message || error.toString();
    }
    
    return thunkAPI.rejectWithValue(message);
  }
});

// FONCTION 2 : SE CONNECTER
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    // --- MÊME AMÉLIORATION ICI ---
    let message;
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else if (error.message === "Network Error") {
      message = "Impossible de contacter le serveur. Vérifiez votre connexion.";
    } else {
      message = error.message || error.toString();
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // On efface les vieilles erreurs quand on commence
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Ici on récupère notre beau message français
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;