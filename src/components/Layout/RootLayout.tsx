import { DarkMode, LightMode } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { DashboardProvider } from "src/contexts/DashboardContext";
import { ThemeProvider, useThemeMode } from "src/contexts/ThemeContext";
import { ThemeModes } from "src/utils/themeUtils";

function AppContent() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <>
      <CssBaseline />
      <DashboardProvider>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Box
                component="img"
                src="/marine-logo.svg"
                alt="Marine Operations Logo"
                sx={{
                  height: 32,
                  width: 32,
                  mr: 2,
                }}
              />
              <Typography variant="h6" component="div">
                Marine Operations Dashboard
              </Typography>
            </Box>
            <Tooltip
              title={`Switch to ${
                mode === ThemeModes.light ? "dark" : "light"
              } mode`}
            >
              <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                {mode === ThemeModes.light ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="inherit">
              Entail Platform
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          sx={{ py: 3, px: 2, width: "100%", minHeight: "calc(100vh - 64px)" }}
        >
          <Outlet />
        </Box>
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </DashboardProvider>
    </>
  );
}

export function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
