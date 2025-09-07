import { createTheme } from "@mui/material/styles";

const commonTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
    },
    error: {
      main: "#d32f2f",
      light: "#f44336",
      dark: "#c62828",
    },
  },
});

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      light: "#bbdefb",
      dark: "#64b5f6",
    },
    secondary: {
      main: "#ce93d8",
      light: "#e1bee7",
      dark: "#ba68c8",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#4caf50",
    },
    warning: {
      main: "#ffb74d",
      light: "#ffcc02",
      dark: "#ff9800",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    grey: {
      50: "#2c2c2c",
      100: "#323232",
      200: "#3a3a3a",
      300: "#474747",
      400: "#545454",
      500: "#626262",
      600: "#8d8d8d",
      700: "#a0a0a0",
      800: "#bdbdbd",
      900: "#e0e0e0",
      A100: "#323232",
      A200: "#3a3a3a",
      A400: "#545454",
      A700: "#a0a0a0",
    },
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.12)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export const ThemeModes = {
  light: "light",
  dark: "dark",
} as const;

export type ThemeMode = keyof typeof ThemeModes;

export function getTheme(mode: ThemeMode) {
  return mode === "dark" ? darkTheme : lightTheme;
}
