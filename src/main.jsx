// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { Provider } from 'react-redux'; // 1. Import Provider
import { store } from './store';        // 2. Import Store

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. On enveloppe TOUT avec le Provider Redux */}
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);