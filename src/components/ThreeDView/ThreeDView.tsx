import { Image } from "@mui/icons-material";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  useTheme,
} from "@mui/material";
import { memo } from "react";
import type { Task } from "src/types";
import { getTaskImage } from "src/utils/assetUtils";
import { CARD_HEIGHTS, useIsSmallScreen } from "src/utils/responsiveUtils";
import { EmptyState, LoadingState } from "src/utils/stateUtils";
import { getTaskIcon } from "src/utils/taskIcons";
import {
  getTaskDescription,
  getTaskDurationText,
  getWaveHeightLimitText,
  getWavePeriodLimitText,
} from "src/utils/taskUtils";

interface ThreeDViewProps {
  selectedTask: Task | null;
  loading?: boolean;
}

const ThreeDViewComponent = ({
  selectedTask,
  loading = false,
}: ThreeDViewProps) => {
  const theme = useTheme();
  const isSmallScreen = useIsSmallScreen();
  const cardHeight = CARD_HEIGHTS.threeDView;

  if (loading) {
    return (
      <LoadingState
        height={cardHeight}
        variant="card"
        message="Loading 3D Visualization..."
      />
    );
  }

  if (!selectedTask) {
    return (
      <EmptyState
        title="3D Visualization"
        message="Select a task to view its 3D representation"
        height={cardHeight}
        icon={<Image sx={{ fontSize: 48, color: "text.secondary" }} />}
      />
    );
  }

  const taskImage = getTaskImage(selectedTask.name);

  return (
    <Card sx={{ height: cardHeight }}>
      <CardContent sx={{ height: "100%", p: 2 }}>
        <Box
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              flex: { xs: "0 0 40%", md: "0 0 50%" },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.95)
                  : alpha(theme.palette.background.paper, 0.95),
              borderRight: {
                md: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              },
              borderBottom: {
                xs: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                md: "none",
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              {getTaskIcon(selectedTask.name)}
              <Typography
                variant={isSmallScreen ? "subtitle1" : "h6"}
                component="div"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                {selectedTask.name}
              </Typography>
              <Chip
                label={getTaskDurationText(selectedTask.duration)}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {getTaskDescription(selectedTask.name)}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              <Chip
                label={getWaveHeightLimitText(selectedTask.weatherLimits.Hs)}
                size="small"
                variant="outlined"
              />
              <Chip
                label={getWavePeriodLimitText(selectedTask.weatherLimits.Tp)}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: { xs: "1", md: "0 0 50%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: { xs: 1, sm: 2 },
              pl: { xs: 0, md: 2 },
              position: "relative",
            }}
          >
            {taskImage ? (
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxHeight: { xs: "200px", sm: "250px", md: "300px" },
                }}
              >
                <img
                  src={taskImage}
                  alt={`${selectedTask.name} visualization`}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: theme.shadows[2],
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.action.active, 0.1)
                      : theme.palette.grey[50],
                  borderRadius: 2,
                }}
              >
                <Image sx={{ fontSize: "3rem", opacity: 0.2 }} />
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ThreeDView = memo(ThreeDViewComponent);
