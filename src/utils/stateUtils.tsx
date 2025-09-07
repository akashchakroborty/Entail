import { SearchOff } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import type { ReactElement } from "react";

interface LoadingStateProps {
  message?: string;
  height?: string | number | object;
  variant?: "timeline" | "chart" | "card" | "dialog" | "default";
  showProgress?: boolean;
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  height?: string | number | object;
  icon?: ReactElement;
  action?: ReactElement;
}

export function LoadingState({
  message,
  height = 300,
  variant = "default",
  showProgress = true,
}: LoadingStateProps): ReactElement {
  const theme = useTheme();
  const renderSkeleton = () => {
    switch (variant) {
      case "timeline":
        return (
          <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Skeleton
              variant="text"
              width="50%"
              sx={{
                height: { xs: 24, sm: 28 },
                mb: { xs: 1.5, sm: 2 },
              }}
            />
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ display: "flex", mb: { xs: 2, sm: 3 } }}>
                <Skeleton
                  variant="circular"
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    mr: { xs: 1.5, sm: 2 },
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton
                    variant="text"
                    width="70%"
                    sx={{ height: { xs: 20, sm: 24 } }}
                  />
                  <Skeleton
                    variant="text"
                    width="50%"
                    sx={{
                      height: { xs: 16, sm: 20 },
                      mt: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 0.5, sm: 1 },
                      mt: { xs: 0.5, sm: 1 },
                      flexWrap: "wrap",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        width: { xs: 50, sm: 60 },
                        height: { xs: 20, sm: 24 },
                        borderRadius: 12,
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        width: { xs: 65, sm: 80 },
                        height: { xs: 20, sm: 24 },
                        borderRadius: 12,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        );

      case "chart":
        return (
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Skeleton
                variant="rectangular"
                width={80}
                height={32}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={32}
                sx={{ borderRadius: 1 }}
              />
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        );

      case "card":
        return (
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={120}
              sx={{ borderRadius: 1, mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton
                variant="rectangular"
                width={60}
                height={24}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={24}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          </Box>
        );

      case "dialog":
        return (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Skeleton variant="circular" width={60} height={60} />
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        );

      default:
        return (
          <Box sx={{ p: 3, textAlign: "center" }}>
            {showProgress && (
              <Box sx={{ mb: 2 }}>
                <CircularProgress size={40} />
              </Box>
            )}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={120}
              sx={{ borderRadius: 1, mb: 2 }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={24}
              sx={{ mx: "auto", mb: 1 }}
            />
            <Skeleton
              variant="text"
              width="40%"
              height={20}
              sx={{ mx: "auto" }}
            />
          </Box>
        );
    }
  };

  return (
    <Card sx={{ height, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {renderSkeleton()}
        {message !== "" && (
          <Box
            sx={{
              textAlign: "center",
              p: { xs: 1.5, sm: 2 },
              pt: { xs: 1, sm: 1 },
            }}
          >
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "0.875rem" },
                fontWeight: 500,
              }}
            >
              {message ?? "Loading..."}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title = "No Data Available",
  message = "There's nothing to display right now.",
  height = "100%",
  icon = <SearchOff sx={{ fontSize: 48, color: "text.secondary" }} />,
  action,
}: EmptyStateProps): ReactElement {
  return (
    <Card sx={{ height }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 4,
            px: 2,
          }}
        >
          <Box sx={{ mb: 2 }}>{icon}</Box>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: action ? 3 : 0, maxWidth: 300 }}
          >
            {message}
          </Typography>
          {action && action}
        </Box>
      </CardContent>
    </Card>
  );
}

export function InlineLoadingState({
  message = "Loading...",
  showProgress = true,
}: {
  message?: string;
  showProgress?: boolean;
}): ReactElement {
  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      {showProgress && (
        <Box sx={{ mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
