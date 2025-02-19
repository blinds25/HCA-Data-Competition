// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define your custom theme.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff', // white text for primary elements
    },
    secondary: {
      main: '#FF6600', // HCA orange accent
    },
    background: {
      default: '#003366', // HCA blue background
      paper: '#003366',   // use the same for paper if desired
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
