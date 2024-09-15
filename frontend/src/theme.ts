import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc', // A soft purple
    },
    secondary: {
      main: '#03dac6', // Teal color for accents
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1d1d1d', // Slightly lighter for cards
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px', // Rounded corners for buttons
        },
      },
    },
  },
});
