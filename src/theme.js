// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D84315',   // deep pizza‑sauce red
    },
    secondary: {
      main: '#F9A825',   // cheesy yellow
    },
    background: {
      default: '#fff8f0' // soft, warm off‑white
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    button: { textTransform: 'none' }
  },
});

export default theme;
