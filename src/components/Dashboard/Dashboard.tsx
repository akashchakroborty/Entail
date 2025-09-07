import { Refresh } from "@mui/icons-material";
import { Box, Fab, Typography, useTheme } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { GoNoGoDialog } from "src/components/GoNoGoDialog/GoNoGoDialog";
import { ProjectTimeline } from "src/components/ProjectTimeline/ProjectTimeline";
import { ThreeDView } from "src/components/ThreeDView/ThreeDView";
import { WeatherForecast } from "src/components/WeatherForecast/WeatherForecast";
import { useDashboard } from "src/contexts/DashboardContext";
import { mockProjectData, mockWeatherForecast } from "src/data/mockData";
import type { Task } from "src/types";
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
  const { selectedTask, setSelectedTask, loading, setLoading } = useDashboard();
  const [goNoGoDialogOpen, setGoNoGoDialogOpen] = useState(false);

  const currentProject = mockProjectData.projects[0];
  const tasks = currentProject?.tasks || [];

  const goNoGoStatuses = useMemo(() => {
    return calculateGoNoGoStatuses(tasks, mockWeatherForecast.forecast);
  }, [tasks]);

  const selectedTaskGoNoGo = selectedTask
    ? goNoGoStatuses[selectedTask.id] || null
    : null;

  const selectedTaskWeather = useMemo(() => {
    if (!selectedTask) return null;
    return getWeatherForTask(mockWeatherForecast.forecast, selectedTask);
  }, [selectedTask]);

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setGoNoGoDialogOpen(true);
    }
  };

  const handleTaskSelection = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleTaskSelectionFromChart = (task: Task) => {
    setSelectedTask(task);
  };

  const onRefresh = () => handleRefresh(setLoading);

  useEffect(() => {
    if (tasks.length > 0 && !selectedTask) {
      setSelectedTask(tasks[0]);
    }
  }, [tasks, selectedTask, setSelectedTask]);

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
          <ProjectTimeline
            tasks={tasks}
            selectedTaskId={selectedTask?.id || null}
            onTaskSelect={handleTaskSelect}
            onTaskSelection={handleTaskSelection}
            goNoGoStatuses={goNoGoStatuses}
            loading={loading}
          />
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

          <WeatherForecast
            weatherData={mockWeatherForecast}
            selectedTask={selectedTask}
            tasks={tasks}
            onTaskSelect={handleTaskSelectionFromChart}
            loading={loading}
          />
        </Box>
      </Box>

      <GoNoGoDialog
        open={goNoGoDialogOpen}
        onClose={() => setGoNoGoDialogOpen(false)}
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
