import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Keep Bootstrap’s CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// MUI theme setup
import theme from './theme';
import { ThemeProvider, CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* Normalize browser styles and apply theme */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
