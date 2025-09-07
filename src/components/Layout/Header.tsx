import { DarkMode, LightMode } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useThemeMode } from "src/contexts/ThemeContext";
import { createAriaLabel } from "src/utils/accessibilityUtils";
import { ThemeModes } from "src/utils/themeUtils";

export const Header = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar position="static" elevation={1} component="header" role="banner">
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
          <Typography variant="h6" component="h1">
            Marine Operations Dashboard
          </Typography>
        </Box>
        <Tooltip
          title={`Switch to ${
            mode === ThemeModes.light ? "dark" : "light"
          } mode`}
        >
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{ mr: 1 }}
            aria-label={createAriaLabel(
              `Switch to ${mode === ThemeModes.light ? "dark" : "light"} mode`
            )}
          >
            {mode === ThemeModes.light ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" color="inherit">
          Entail Platform
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
