import { Box, useTheme } from "@mui/material";
import { Outlet } from "@tanstack/react-router";

export const MainContent = () => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      id="main-content"
      tabIndex={-1}
      sx={{
        py: 3,
        px: 2,
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        outline: "none",
        "&:focus": {
          boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}40`,
          animation: "focusHighlight 0.8s ease-out",
        },
      }}
      role="main"
      aria-label="Marine Operations Dashboard Content"
    >
      <Outlet />
    </Box>
  );
};
