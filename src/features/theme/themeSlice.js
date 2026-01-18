import { createSlice } from '@reduxjs/toolkit';

// On regarde si une préférence est déjà sauvegardée, sinon "dark" par défaut (Identité Yély)
const localTheme = localStorage.getItem('theme');
const initialState = {
  mode: localTheme ? localTheme : 'dark', 
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode); // On sauvegarde le choix
    },
    setMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme, setMode } = themeSlice.actions;
export default themeSlice.reducer;