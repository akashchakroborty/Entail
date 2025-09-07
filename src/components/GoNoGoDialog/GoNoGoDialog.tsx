import {
  CheckCircle,
  Close,
  Error,
  Info,
  Refresh,
  TrendingDown,
  TrendingUp,
  Warning,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { cloneElement, memo } from "react";
import type { GoNoGoStatus, Task, WeatherDataPoint } from "src/types";
import { createAriaLabel } from "src/utils/accessibilityUtils";
import {
  getFormattedGoNoGoReason,
  getGoNoGoStatusColor,
  getGoNoGoStatusText,
  isGoNoGoCaution,
  isGoNoGoNoGo,
} from "src/utils/goNoGoUtils";
import { EmptyState } from "src/utils/stateUtils";
import { getTaskDurationText } from "src/utils/taskUtils";
import { formatTimestamp } from "src/utils/weatherUtils";

interface GoNoGoDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTask: Task | null;
  goNoGoStatus: GoNoGoStatus | null;
  currentWeather: WeatherDataPoint | null;
  onRefresh?: () => void;
  loading?: boolean;
}

const getStatusIcon = (loading: boolean, goNoGoStatus: GoNoGoStatus | null) => {
  if (loading) return <Refresh sx={{ animation: "spin 1s linear infinite" }} />;
  if (!goNoGoStatus) return <Warning />;
  if (isGoNoGoNoGo(goNoGoStatus)) return <Error />;

  const isCaution = isGoNoGoCaution(goNoGoStatus);
  return isCaution ? <Warning /> : <CheckCircle />;
};

const getStatusText = (loading: boolean, goNoGoStatus: GoNoGoStatus | null) => {
  if (loading) return "Analyzing...";
  return getGoNoGoStatusText(goNoGoStatus || undefined);
};

const getWaveHeightPercentage = (
  currentWeather: WeatherDataPoint | null,
  selectedTask: Task | null
) => {
  if (!currentWeather || !selectedTask) return 0;
  return Math.min(
    (currentWeather.wave_height / selectedTask.weatherLimits.Hs) * 100,
    100
  );
};

const getWavePeriodStatus = (
  currentWeather: WeatherDataPoint | null,
  selectedTask: Task | null
) => {
  if (!currentWeather || !selectedTask) return "unknown";
  const { wave_period } = currentWeather;
  const [minPeriod, maxPeriod] = selectedTask.weatherLimits.Tp;

  if (wave_period < minPeriod) return "low";
  if (wave_period > maxPeriod) return "high";
  return "ok";
};

const GoNoGoDialogComponent = ({
  open,
  onClose,
  selectedTask,
  goNoGoStatus,
  currentWeather,
  onRefresh,
  loading = false,
}: GoNoGoDialogProps) => {
  const theme = useTheme();

  const statusColor = getGoNoGoStatusColor(goNoGoStatus || undefined);
  const statusIcon = getStatusIcon(loading, goNoGoStatus);
  const statusText = getStatusText(loading, goNoGoStatus);
  const waveHeightPercentage = getWaveHeightPercentage(
    currentWeather,
    selectedTask
  );
  const wavePeriodStatus = getWavePeriodStatus(currentWeather, selectedTask);

  if (!selectedTask) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Go/No-Go Decision
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EmptyState
            title="No Task Selected"
            message="Select a task from the timeline to view Go/No-Go analysis"
            icon={<Info sx={{ fontSize: 48, color: "text.secondary" }} />}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Go/No-Go Decision
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {onRefresh && (
            <IconButton onClick={onRefresh} disabled={loading} size="small">
              <Refresh />
            </IconButton>
          )}
          <IconButton
            onClick={onClose}
            size="small"
            aria-label={createAriaLabel("Close dialog", "Go/No-Go Decision")}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {selectedTask.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {getTaskDurationText(selectedTask.duration)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedTask.startDate} to {selectedTask.endDate}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            p: 3,
            backgroundColor: (() => {
              if (statusColor === "default") {
                return theme.palette.mode === "dark"
                  ? alpha(theme.palette.action.selected, 0.3)
                  : theme.palette.grey[100];
              }
              return `${theme.palette[statusColor].main}${
                theme.palette.mode === "dark" ? "25" : "15"
              }`;
            })(),
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {cloneElement(statusIcon, {
              sx: { fontSize: 40, color: `${statusColor}.main` },
            })}
          </Box>
          <Typography
            variant="h4"
            color={`${statusColor}.main`}
            fontWeight="bold"
            gutterBottom
          >
            {statusText}
          </Typography>
          {goNoGoStatus && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 300 }}
            >
              {getFormattedGoNoGoReason(goNoGoStatus)}
            </Typography>
          )}
        </Box>

        {currentWeather && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Weather Conditions vs Limits
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Wave Height</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {currentWeather.wave_height.toFixed(1)}m /{" "}
                  {selectedTask.weatherLimits.Hs}m
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={waveHeightPercentage}
                color={waveHeightPercentage > 100 ? "error" : "success"}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {waveHeightPercentage.toFixed(0)}% of limit
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2">Wave Period</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {currentWeather.wave_period.toFixed(1)}s
                  </Typography>
                  {wavePeriodStatus === "low" && (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  {wavePeriodStatus === "high" && (
                    <TrendingUp color="error" fontSize="small" />
                  )}
                  {wavePeriodStatus === "ok" && (
                    <CheckCircle color="success" fontSize="small" />
                  )}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={`Min: ${selectedTask.weatherLimits.Tp[0]}s`}
                  size="small"
                  variant="outlined"
                  color={
                    currentWeather.wave_period >=
                    selectedTask.weatherLimits.Tp[0]
                      ? "success"
                      : "error"
                  }
                />
                <Chip
                  label={`Max: ${selectedTask.weatherLimits.Tp[1]}s`}
                  size="small"
                  variant="outlined"
                  color={
                    currentWeather.wave_period <=
                    selectedTask.weatherLimits.Tp[1]
                      ? "success"
                      : "error"
                  }
                />
              </Box>
            </Box>
          </Box>
        )}

        {goNoGoStatus && (
          <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatTimestamp(goNoGoStatus.timestamp)}
            </Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ mt: 2 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={4}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const GoNoGoDialog = memo(GoNoGoDialogComponent);
