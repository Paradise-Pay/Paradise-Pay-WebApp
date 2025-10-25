// Theme configuration for Material-UI components
import { createTheme } from "@mui/material/styles";

/**
 * Light theme configuration
 * Uses Paradise Pay brand colors with light background
 */
export const lightTheme = createTheme({
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
  palette: {
    mode: "dark",
    primary: { main: "#2f89ff" }, // Paradise Pay blue
    secondary: { main: "#ffc03a" }, // Paradise Pay yellow
    background: { default: "#121212" },
  },
});
