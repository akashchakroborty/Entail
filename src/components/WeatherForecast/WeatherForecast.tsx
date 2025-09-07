import { AccessTime, Waves, ZoomIn, ZoomOut } from "@mui/icons-material";
import {
  alpha,
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Task, WeatherForecast as WeatherForecastType } from "src/types";
import {
  CARD_HEIGHTS,
  useIsMobile,
  useIsSmallScreen,
} from "src/utils/responsiveUtils";
import { LoadingState } from "src/utils/stateUtils";
import {
  findTaskByDataIndex,
  getFilteredWeatherData,
  getHighlightedRange,
  getWeatherRangeStats,
} from "src/utils/weatherUtils";

interface WeatherForecastProps {
  weatherData: WeatherForecastType;
  selectedTask?: Task | null;
  tasks?: Task[];
  loading?: boolean;
  onTaskSelect?: (task: Task) => void;
}

export function WeatherForecast({
  weatherData,
  selectedTask,
  tasks = [],
  loading = false,
  onTaskSelect,
}: WeatherForecastProps) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSmallScreen = useIsSmallScreen();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setIsZoomed(true);
    }
  }, [selectedTask]);

  const highlightRange = useMemo(
    () => getHighlightedRange(selectedTask || null, weatherData.forecast),
    [selectedTask, weatherData.forecast]
  );

  const chartData = useMemo(
    () =>
      getFilteredWeatherData(
        weatherData.forecast,
        selectedTask || null,
        highlightRange,
        isZoomed,
        isSmallScreen
      ),
    [
      weatherData.forecast,
      selectedTask,
      highlightRange,
      isZoomed,
      isSmallScreen,
    ]
  );

  const weatherStats = useMemo(
    () =>
      getWeatherRangeStats(
        weatherData.forecast,
        selectedTask || null,
        highlightRange,
        chartData.waveHeights,
        chartData.wavePeriods
      ),
    [
      weatherData.forecast,
      selectedTask,
      highlightRange,
      chartData.waveHeights,
      chartData.wavePeriods,
    ]
  );

  const handleChartClick = useCallback(
    (_event: any, itemIndex: number) => {
      if (!onTaskSelect) return;

      const matchingTask = findTaskByDataIndex(
        itemIndex,
        weatherData.forecast,
        tasks,
        selectedTask || null,
        chartData.dataRange || null
      );

      if (matchingTask) {
        onTaskSelect(matchingTask);
      }
    },
    [
      onTaskSelect,
      weatherData.forecast,
      tasks,
      selectedTask,
      chartData.dataRange,
    ]
  );

  const handleZoomToggle = useCallback(() => {
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  const { waveHeights, wavePeriods, timestamps, filteredRange } = chartData;

  const waveHeightSeries = useMemo(
    () => [
      {
        data: waveHeights,
        label: "Wave Height",
        color: theme.palette.primary.main,
      },
      ...(selectedTask && highlightRange
        ? [
            {
              data: waveHeights.map((value, index) => {
                if (isZoomed && filteredRange) {
                  return index >= filteredRange.start &&
                    index <= filteredRange.end
                    ? value
                    : 0;
                } else {
                  return index >= highlightRange.start &&
                    index <= highlightRange.end
                    ? value
                    : 0;
                }
              }),
              label: `${selectedTask.name} Period`,
              color: theme.palette.text.primary,
            },
          ]
        : []),
    ],
    [
      waveHeights,
      selectedTask,
      highlightRange,
      isZoomed,
      filteredRange,
      theme.palette.primary.main,
    ]
  );

  const wavePeriodSeries = useMemo(
    () => [
      {
        data: wavePeriods,
        label: "Wave Period",
        color: theme.palette.secondary.main,
      },
      ...(selectedTask && highlightRange
        ? [
            {
              data: wavePeriods.map((value, index) => {
                if (isZoomed && filteredRange) {
                  return index >= filteredRange.start &&
                    index <= filteredRange.end
                    ? value
                    : 0;
                } else {
                  return index >= highlightRange.start &&
                    index <= highlightRange.end
                    ? value
                    : 0;
                }
              }),
              label: `${selectedTask.name} Period`,
              color: theme.palette.text.primary,
            },
          ]
        : []),
    ],
    [
      wavePeriods,
      selectedTask,
      highlightRange,
      isZoomed,
      filteredRange,
      theme.palette.secondary.main,
    ]
  );

  if (loading) {
    return (
      <LoadingState
        variant="chart"
        message="Loading weather forecast..."
        height={CARD_HEIGHTS.weatherForecast}
      />
    );
  }

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: CARD_HEIGHTS.weatherForecast,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            mb: { xs: 0.5, sm: 1 },
            flexWrap: "wrap",
          }}
        >
          <Waves
            color="primary"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          />
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            component="h2"
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, flex: 1 }}
          >
            Weather Forecast
            {selectedTask && isZoomed && (
              <Typography
                component="span"
                variant="body2"
                color="primary"
                sx={{ ml: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                (Zoomed: {selectedTask.name})
              </Typography>
            )}
          </Typography>

          {selectedTask && (
            <Tooltip
              title={isZoomed ? "Show full timeline" : "Zoom to task period"}
            >
              <IconButton
                onClick={handleZoomToggle}
                size="small"
                color="primary"
                sx={{ mr: 1 }}
              >
                {isZoomed ? <ZoomOut /> : <ZoomIn />}
              </IconButton>
            </Tooltip>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {weatherData.location.lat.toFixed(1)}°N,{" "}
            {weatherData.location.lon.toFixed(1)}°E
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: { xs: 1, sm: 1.5 },
            flex: 1,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: { xs: 180, sm: 210, md: 250 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Waves fontSize="small" />
              <Typography
                variant={isSmallScreen ? "body1" : "h6"}
                sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
              >
                Wave Height (m)
              </Typography>
            </Box>
            <Box sx={{ width: "100%", overflow: "hidden" }}>
              <BarChart
                width={undefined}
                height={isSmallScreen ? 170 : isMobile ? 200 : 230}
                onItemClick={(event, d) => {
                  if (d && typeof d.dataIndex === "number") {
                    handleChartClick(event, d.dataIndex);
                  }
                }}
                series={waveHeightSeries}
                xAxis={[
                  {
                    scaleType: "band" as const,
                    data: timestamps,
                  },
                ]}
                margin={{
                  left: isSmallScreen ? 30 : 40,
                  right: isSmallScreen ? 15 : 20,
                  top: isSmallScreen ? 15 : 20,
                  bottom: isSmallScreen ? 30 : 40,
                }}
                grid={{ vertical: false, horizontal: true }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: { xs: 180, sm: 210, md: 250 },
              width: "100%",
            }}
          >
            <Typography
              variant={isSmallScreen ? "body1" : "h6"}
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1rem", sm: "1.125rem" },
                mb: { xs: 0.5, sm: 1 },
              }}
            >
              <AccessTime fontSize="small" />
              Wave Period (s)
            </Typography>
            <Box sx={{ width: "100%", overflow: "hidden" }}>
              <BarChart
                width={undefined}
                height={isSmallScreen ? 170 : isMobile ? 200 : 230}
                onItemClick={(event, d) => {
                  if (d && typeof d.dataIndex === "number") {
                    handleChartClick(event, d.dataIndex);
                  }
                }}
                series={wavePeriodSeries}
                xAxis={[
                  {
                    scaleType: "band" as const,
                    data: timestamps,
                  },
                ]}
                margin={{
                  left: isSmallScreen ? 30 : 40,
                  right: isSmallScreen ? 15 : 20,
                  top: isSmallScreen ? 15 : 20,
                  bottom: isSmallScreen ? 30 : 40,
                }}
                grid={{ vertical: false, horizontal: true }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.action.selected, 0.2)
                : theme.palette.grey[50],
            borderRadius: 1,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "auto" } }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Current Conditions
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Wave Height:{" "}
              <strong>
                {weatherData.forecast[0]?.wave_height.toFixed(1)}m
              </strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Wave Period:{" "}
              <strong>
                {weatherData.forecast[0]?.wave_period.toFixed(1)}s
              </strong>
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "auto" } }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {selectedTask
                ? `Range (${selectedTask.name})`
                : "Range (All Data)"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Height: {weatherStats.heightMin.toFixed(1)} -{" "}
              {weatherStats.heightMax.toFixed(1)}m
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Period: {weatherStats.periodMin.toFixed(1)} -{" "}
              {weatherStats.periodMax.toFixed(1)}s
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
