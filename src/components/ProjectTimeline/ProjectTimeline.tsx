import { Schedule } from "@mui/icons-material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { memo } from "react";
import type { GoNoGoStatus, Task } from "src/types";
import {
  getFormattedGoNoGoReason,
  getGoNoGoStatusColor,
  getGoNoGoStatusText,
} from "src/utils/goNoGoUtils";
import {
  CARD_HEIGHTS,
  getMobileTextStyles,
  useIsMobile,
} from "src/utils/responsiveUtils";
import { LoadingState } from "src/utils/stateUtils";
import { getTaskIcon } from "src/utils/taskIcons";
import {
  getTaskDurationText,
  getWaveHeightLimitText,
  getWavePeriodLimitText,
  sortTasksByStartDate,
} from "src/utils/taskUtils";
import { isTaskActive } from "src/utils/weatherUtils";

interface ProjectTimelineProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
  onTaskSelection?: (taskId: string) => void;
  goNoGoStatuses: Record<string, GoNoGoStatus>;
  loading?: boolean;
}

const getGoNoGoChip = (status: GoNoGoStatus | undefined) => {
  const statusText = getGoNoGoStatusText(status);
  const statusColor = getGoNoGoStatusColor(status);

  return (
    <Chip
      label={statusText}
      size="small"
      variant={status ? "filled" : "outlined"}
      color={statusColor}
      sx={{ fontSize: "0.7rem", fontWeight: status ? "bold" : "normal" }}
    />
  );
};

const getTaskColor = (isSelected: boolean, isActive: boolean) => {
  if (isSelected) return "primary";
  if (!isActive) return "grey";
  return "primary";
};

const ProjectTimelineComponent = ({
  tasks,
  selectedTaskId,
  onTaskSelect,
  onTaskSelection,
  goNoGoStatuses,
  loading = false,
}: ProjectTimelineProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <LoadingState
        variant="timeline"
        message="Loading project timeline..."
        height={CARD_HEIGHTS.projectTimeline}
      />
    );
  }

  const sortedTasks = sortTasksByStartDate(tasks);

  return (
    <Card
      sx={{
        height: "fit-content",
        minHeight: CARD_HEIGHTS.projectTimeline,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Schedule color="primary" />
          <Typography variant="h6" component="div">
            Project Timeline
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: "auto" }}
          >
            {tasks.length} tasks
          </Typography>
        </Box>

        <Timeline position={isMobile ? "right" : "alternate"}>
          {sortedTasks.map((task, index) => {
            const isSelected = task.id === selectedTaskId;
            const isActive = isTaskActive(task);
            const status = goNoGoStatuses[task.id];
            const startDate = parseISO(task.startDate);
            const taskColor = getTaskColor(isSelected, isActive);

            return (
              <TimelineItem key={task.id}>
                <TimelineOppositeContent
                  sx={{
                    m: "auto 0",
                    display: isMobile ? "none" : "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    pr: 2,
                    maxWidth: { xs: "120px", sm: "150px" },
                  }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {format(startDate, "MMM dd")}
                  </Typography>
                  <Typography variant="caption">
                    {getTaskDurationText(task.duration)}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>{getGoNoGoChip(status)}</Box>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot
                    color={taskColor}
                    variant={
                      isSelected ? "filled" : isActive ? "filled" : "outlined"
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      transform: isSelected ? "scale(1.2)" : "scale(1)",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                    onClick={() => onTaskSelect(task.id)}
                  >
                    {getTaskIcon(task.name)}
                  </TimelineDot>
                  {index < sortedTasks.length - 1 && (
                    <TimelineConnector
                      sx={{
                        bgcolor: isActive ? taskColor + ".main" : "grey.300",
                        width: isActive ? 3 : 2,
                        transition: "all 0.2s ease-in-out",
                      }}
                    />
                  )}
                </TimelineSeparator>

                <TimelineContent
                  sx={{
                    py: "12px",
                    px: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                    backgroundColor: isSelected
                      ? "action.selected"
                      : "transparent",
                  }}
                  onClick={() =>
                    onTaskSelection
                      ? onTaskSelection(task.id)
                      : onTaskSelect(task.id)
                  }
                >
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="h6"
                      component="span"
                      sx={{
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                        wordBreak: isMobile ? "break-word" : "normal",
                        lineHeight: 1.3,
                      }}
                    >
                      {task.name}
                    </Typography>
                    {isMobile && (
                      <Box
                        sx={{
                          mt: 0.5,
                          display: "flex",
                          gap: 1,
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            minWidth: "fit-content",
                            lineHeight: 1.4,
                          }}
                        >
                          {format(startDate, "MMM dd")} •{" "}
                          {getTaskDurationText(task.duration)}
                        </Typography>
                        {getGoNoGoChip(status)}
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={getWaveHeightLimitText(task.weatherLimits.Hs)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem" }}
                    />
                    <Chip
                      label={getWavePeriodLimitText(task.weatherLimits.Tp)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  </Box>

                  {status && (
                    <Box>
                      <Tooltip
                        title={`Click to view detailed Go/No-Go analysis for ${task.name}`}
                        arrow
                      >
                        <Typography
                          variant="body2"
                          color={`${getGoNoGoStatusColor(status)}.main`}
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            ...getMobileTextStyles(isMobile),
                            opacity: isActive ? 1 : 0.7,
                            cursor: "pointer",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              textDecorationColor: "currentColor",
                              opacity: 1,
                              transform: "translateY(-1px)",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskSelect(task.id);
                          }}
                        >
                          {getFormattedGoNoGoReason(status)}
                        </Typography>
                      </Tooltip>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.7rem",
                          display: "block",
                          mt: 0.5,
                          opacity: isActive ? 1 : 0.7,
                        }}
                      >
                        Forecast:{" "}
                        {format(parseISO(status.timestamp), "MMM dd, HH:mm")}
                      </Typography>
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.action.selected, 0.2)
                : theme.palette.grey[50],
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Forecast-Based Decisions
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip
                label="GO"
                size="small"
                color="success"
                sx={{ fontSize: "0.7rem" }}
              />
              <Typography variant="caption">Proceed</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip
                label="NO-GO"
                size="small"
                color="error"
                sx={{ fontSize: "0.7rem" }}
              />
              <Typography variant="caption">Cannot proceed</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip
                label="CAUTION"
                size="small"
                color="warning"
                sx={{ fontSize: "0.7rem" }}
              />
              <Typography variant="caption">Proceed with caution</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip
                label="No Data"
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
              <Typography variant="caption">No forecast available</Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Each task shows Go/No-Go decision based on weather forecast for its
            scheduled timeframe
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ProjectTimeline = memo(ProjectTimelineComponent);
