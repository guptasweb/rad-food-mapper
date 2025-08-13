import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { deepPurple, purple } from '@mui/material/colors';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);

const theme = createTheme({
  palette: {
    primary: {
      light: deepPurple[100],
      main: deepPurple[400],
      dark: deepPurple[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: purple[200],
      dark: purple[400],
      contrastText: '#0b0b0b',
    },
    background: {
      default: purple[50],
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
    fontSize: 16,
  },
});

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);

