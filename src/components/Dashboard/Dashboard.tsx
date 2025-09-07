import { Refresh } from "@mui/icons-material";
import { Box, Fab, Typography, useTheme } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { ErrorState } from "src/components/ErrorState/ErrorState";
import { GoNoGoDialog } from "src/components/GoNoGoDialog/GoNoGoDialog";
import { ProjectTimeline } from "src/components/ProjectTimeline/ProjectTimeline";
import { ThreeDView } from "src/components/ThreeDView/ThreeDView";
import { WeatherForecast } from "src/components/WeatherForecast/WeatherForecast";
import { useDashboard } from "src/contexts/DashboardContext";
import { mockProjectData, mockWeatherForecast } from "src/data/mockData";
import type { Task } from "src/types";
import { announceToScreenReader } from "src/utils/accessibilityUtils";
import { calculateGoNoGoStatuses } from "src/utils/goNoGoUtils";
import { useIsSmallScreen } from "src/utils/responsiveUtils";
import { getWeatherForTask } from "src/utils/weatherUtils";

const handleRefresh = async (setLoading: (loading: boolean) => void) => {
  setLoading(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    setLoading(false);
  }
};

const DashboardComponent = () => {
  const theme = useTheme();
  const isSmallScreen = useIsSmallScreen();
  const {
    selectedTask,
    setSelectedTask,
    loading,
    setLoading,
    error: contextError,
    setError: setContextError,
    clearError,
  } = useDashboard();
  const [goNoGoDialogOpen, setGoNoGoDialogOpen] = useState(false);
  const [localError, setLocalError] = useState<{
    message: string;
    retry?: () => void;
  } | null>(null);

  const projectData = mockProjectData;
  const weatherForecast = mockWeatherForecast;

  const currentProject = projectData.projects[0];
  const tasks = currentProject?.tasks || [];

  const goNoGoStatuses = useMemo(() => {
    try {
      return calculateGoNoGoStatuses(tasks, weatherForecast.forecast);
    } catch (err) {
      const errorMessage =
        "Failed to calculate Go/No-Go statuses. Please refresh to try again.";
      setLocalError({ message: errorMessage, retry: onRefresh });
      setContextError({ type: "calculation", message: errorMessage });

      announceToScreenReader(
        "Error occurred while calculating Go/No-Go statuses. Please refresh to try again.",
        "assertive"
      );

      return {};
    }
  }, [tasks, setContextError]);

  const selectedTaskGoNoGo = selectedTask
    ? goNoGoStatuses[selectedTask.id] || null
    : null;

  const selectedTaskWeather = useMemo(() => {
    if (!selectedTask) return null;
    return getWeatherForTask(weatherForecast.forecast, selectedTask);
  }, [selectedTask, weatherForecast.forecast]);

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((t: Task) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setGoNoGoDialogOpen(true);
      announceToScreenReader(
        `Task ${task.name} selected. Go/No-Go analysis dialog opened.`,
        "assertive"
      );
    }
  };

  const handleTaskSelection = (taskId: string) => {
    const task = tasks.find((t: Task) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      announceToScreenReader(`Task ${task.name} selected.`);
    }
  };

  const handleTaskSelectionFromChart = (task: Task) => {
    setSelectedTask(task);
    announceToScreenReader(`Task ${task.name} selected from weather chart.`);
  };

  const onRefresh = () => {
    clearError();
    setLocalError(null);
    handleRefresh(setLoading);
    announceToScreenReader("Refreshing data. Please wait.", "polite");

    setTimeout(() => {
      announceToScreenReader("Data refresh complete.", "polite");
    }, 1200);
  };

  useEffect(() => {
    if (tasks.length > 0 && !selectedTask) {
      setSelectedTask(tasks[0]);
    }
  }, [tasks, selectedTask, setSelectedTask]);

  if (!currentProject) {
    return (
      <ErrorState
        title="No Project Data"
        message="Unable to load project data. Please refresh and try again."
        actionLabel="Refresh"
        onActionClick={onRefresh}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <ErrorState
        title="No Tasks Available"
        message="This project doesn't have any tasks defined yet."
        severity="info"
      />
    );
  }

  if (localError) {
    return (
      <ErrorState
        message={localError.message}
        actionLabel={localError.retry ? "Retry" : undefined}
        onActionClick={localError.retry}
      />
    );
  }

  if (contextError) {
    return (
      <ErrorState
        title={`Error: ${contextError.type}`}
        message={contextError.message}
        actionLabel="Refresh"
        onActionClick={onRefresh}
      />
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
        >
          {currentProject.name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          {currentProject.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
            mt: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            <strong>Location:</strong> {currentProject.location.name}
            {!isSmallScreen && (
              <>
                ({currentProject.location.coordinates.lat.toFixed(1)}°N,{" "}
                {currentProject.location.coordinates.lng.toFixed(1)}°E)
              </>
            )}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            <strong>Water Depth:</strong> {currentProject.location.waterDepth}m
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            <strong>Project Manager:</strong> {currentProject.projectManager}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "stretch",
          gap: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Box
            id="timeline-section"
            tabIndex={-1}
            aria-label="Project Timeline Section"
            role="region"
          >
            <ProjectTimeline
              tasks={tasks}
              selectedTaskId={selectedTask?.id || null}
              onTaskSelect={handleTaskSelect}
              onTaskSelection={handleTaskSelection}
              goNoGoStatuses={goNoGoStatuses}
              loading={loading}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: { xs: 2, sm: 3 },
            minWidth: 0,
          }}
        >
          <ThreeDView selectedTask={selectedTask} loading={loading} />

          <Box
            id="weather-section"
            tabIndex={-1}
            aria-label="Weather Forecast Section"
            role="region"
          >
            <WeatherForecast
              weatherData={weatherForecast}
              selectedTask={selectedTask}
              tasks={tasks}
              onTaskSelect={handleTaskSelectionFromChart}
              loading={loading}
            />
          </Box>
        </Box>
      </Box>

      <GoNoGoDialog
        open={goNoGoDialogOpen}
        onClose={() => {
          setGoNoGoDialogOpen(false);
          announceToScreenReader("Go/No-Go analysis dialog closed.", "polite");
        }}
        selectedTask={selectedTask}
        goNoGoStatus={selectedTaskGoNoGo}
        currentWeather={selectedTaskWeather}
        onRefresh={onRefresh}
        loading={loading}
      />

      <Fab
        color="primary"
        aria-label="refresh"
        size={isSmallScreen ? "medium" : "large"}
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: theme.zIndex.fab,
        }}
        onClick={onRefresh}
        disabled={loading}
      >
        <Refresh
          sx={{
            animation: loading ? "spin 1s linear infinite" : "none",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        />
      </Fab>
    </Box>
  );
};

export const Dashboard = memo(DashboardComponent);
