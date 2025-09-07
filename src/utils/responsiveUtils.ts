import { useMediaQuery, useTheme } from "@mui/material";

export function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}

export function useIsSmallScreen() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}

export function getMobileTextStyles(isMobile: boolean) {
  return {
    wordBreak: isMobile ? ("break-word" as const) : ("normal" as const),
    whiteSpace: isMobile ? ("normal" as const) : ("nowrap" as const),
    textOverflow: isMobile ? "unset" : "ellipsis",
    overflow: isMobile ? "visible" : "hidden",
  };
}

export const CARD_HEIGHTS = {
  threeDView: {
    xs: 380,
    sm: 420,
    md: 450,
    lg: 500,
  },
  weatherForecast: {
    xs: 360,
    sm: 400,
    md: 450,
  },
  projectTimeline: {
    xs: 400,
    sm: 500,
    md: 600,
  },
} as const;
