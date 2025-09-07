import { Box } from "@mui/material";
import { SkipLink } from "src/components/SkipLink/SkipLink";

export const NavigationSkipLinks = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <SkipLink
      targetId="main-content"
      text="Skip to main content"
      ariaLabel="Skip to main content section"
    />
    <SkipLink
      targetId="timeline-section"
      text="Skip to project timeline"
      ariaLabel="Skip to project timeline section"
    />
    <SkipLink
      targetId="weather-section"
      text="Skip to weather forecast"
      ariaLabel="Skip to weather forecast section"
    />
  </Box>
);
