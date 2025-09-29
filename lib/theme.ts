// src/theme.ts
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1928ffff" },
    secondary: { main: "#ffee00ff" },
    background: { default: "#f5f5f5" },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1928ffff" },
    secondary: { main: "#ffee00ff" },
    background: { default: "#121212" },
  },
});
