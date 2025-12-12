// Theme configuration for Material-UI components
import { createTheme, ThemeOptions } from "@mui/material/styles";

// Base theme configuration with common settings
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { 
      textTransform: 'none' as const,
      fontWeight: 500 
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        body: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
};

/**
 * Light theme configuration
 * Uses Paradise Pay brand colors with light background
 */
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: { main: "#2f89ff" }, // Paradise Pay blue
    secondary: { main: "#ffc03a" }, // Paradise Pay yellow
    background: { default: "#f5f5f5" },
  },
});

/**
 * Dark theme configuration
 * Uses Paradise Pay brand colors with dark background
 */
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: { main: "#2f89ff" }, // Paradise Pay blue
    secondary: { main: "#ffc03a" }, // Paradise Pay yellow
    background: { default: "#121212" },
  },
});
