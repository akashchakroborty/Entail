import { CssBaseline, GlobalStyles, useTheme } from "@mui/material";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { DashboardProvider } from "src/contexts/DashboardContext";
import { ThemeProvider } from "src/contexts/ThemeContext";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { NavigationSkipLinks } from "./NavigationSkipLinks";

function AppContent() {
  const theme = useTheme();

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "@keyframes focusHighlight": {
            "0%": {
              boxShadow: `inset 0 0 0 4px ${theme.palette.primary.main}40`,
            },
            "100%": {
              boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}20`,
            },
          },
        }}
      />
      <DashboardProvider>
        <NavigationSkipLinks />
        <Header />
        <MainContent />
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
