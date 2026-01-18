// src/features/common/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: {
    open: false,
    message: '',
    severity: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        severity: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;