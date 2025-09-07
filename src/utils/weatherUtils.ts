import { format } from "date-fns";
import type { GoNoGoStatus, Task, WeatherDataPoint } from "src/types";

export function checkTaskFeasibility(
  task: Task,
  currentWeather: WeatherDataPoint
): GoNoGoStatus {
  const { wave_height, wave_period } = currentWeather;
  const { Hs, Tp } = task.weatherLimits;

  const cautionThreshold = Hs * 0.8;
  const periodTolerance = 1.0;

  if (wave_height >= Hs) {
    return {
      canProceed: false,
      reason: `Wave height (${wave_height.toFixed(1)}m) exceeds limit (${Hs}m)`,
      taskId: task.id,
      timestamp: currentWeather.timestamp,
    };
  }

  if (wave_period <= Tp[0] || wave_period >= Tp[1]) {
    return {
      canProceed: false,
      reason: `Wave period (${wave_period.toFixed(
        1
      )}s) outside acceptable range (${Tp[0]}-${Tp[1]}s)`,
      taskId: task.id,
      timestamp: currentWeather.timestamp,
    };
  }

  if (wave_height >= cautionThreshold) {
    return {
      canProceed: true,
      reason: `CAUTION: Wave height (${wave_height.toFixed(
        1
      )}m) approaching limit (${Hs}m)`,
      taskId: task.id,
      timestamp: currentWeather.timestamp,
    };
  }

  if (
    wave_period <= Tp[0] + periodTolerance ||
    wave_period >= Tp[1] - periodTolerance
  ) {
    return {
      canProceed: true,
      reason: `CAUTION: Wave period (${wave_period.toFixed(
        1
      )}s) near range limits (${Tp[0]}-${Tp[1]}s)`,
      taskId: task.id,
      timestamp: currentWeather.timestamp,
    };
  }

  return {
    canProceed: true,
    reason: `GO: Wave height ${wave_height.toFixed(
      1
    )}m, period ${wave_period.toFixed(1)}s - within limits`,
    taskId: task.id,
    timestamp: currentWeather.timestamp,
  };
}

export function getWeatherForTask(
  forecast: WeatherDataPoint[],
  task: Task
): WeatherDataPoint | null {
  if (!forecast.length) return null;

  const taskStartTime = new Date(task.startDate);

  let bestMatch = forecast[0];
  let minTimeDiff = Math.abs(
    new Date(bestMatch.timestamp).getTime() - taskStartTime.getTime()
  );

  for (const point of forecast) {
    const forecastTime = new Date(point.timestamp);
    const timeDiff = Math.abs(forecastTime.getTime() - taskStartTime.getTime());

    if (timeDiff < minTimeDiff) {
      minTimeDiff = timeDiff;
      bestMatch = point;
    }
  }

  return bestMatch;
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function isTaskActive(task: Task): boolean {
  const now = new Date();
  const startDate = new Date(task.startDate);
  const endDate = new Date(task.endDate);

  return now >= startDate && now <= endDate;
}

export function getHighlightedRange(
  selectedTask: Task | null,
  forecast: WeatherDataPoint[]
): { start: number; end: number } | null {
  if (!selectedTask) return null;

  const taskStart = new Date(selectedTask.startDate);
  const taskEnd = new Date(selectedTask.endDate);

  const startIndex = forecast.findIndex((point) => {
    const pointTime = new Date(point.timestamp);
    return pointTime >= taskStart;
  });

  const endIndex = forecast.findIndex((point) => {
    const pointTime = new Date(point.timestamp);
    return pointTime > taskEnd;
  });

  if (startIndex === -1) return null;

  return {
    start: startIndex,
    end: endIndex === -1 ? forecast.length - 1 : endIndex - 1,
  };
}

export function getFilteredWeatherData(
  forecast: WeatherDataPoint[],
  selectedTask: Task | null,
  highlightRange: { start: number; end: number } | null,
  isZoomed: boolean,
  isSmallScreen: boolean
) {
  if (!selectedTask || !highlightRange || !isZoomed) {
    return {
      waveHeights: forecast.map((point) => point.wave_height),
      wavePeriods: forecast.map((point) => point.wave_period),
      timestamps: forecast.map((point) =>
        format(
          new Date(point.timestamp),
          isSmallScreen ? "HH:mm" : "MMM dd HH:mm"
        )
      ),
      dataRange: { start: 0, end: forecast.length - 1 },
    };
  }

  const padding = Math.max(
    2,
    Math.floor((highlightRange.end - highlightRange.start) * 0.2)
  );
  const startIndex = Math.max(0, highlightRange.start - padding);
  const endIndex = Math.min(forecast.length - 1, highlightRange.end + padding);

  const filteredForecast = forecast.slice(startIndex, endIndex + 1);

  return {
    waveHeights: filteredForecast.map((point) => point.wave_height),
    wavePeriods: filteredForecast.map((point) => point.wave_period),
    timestamps: filteredForecast.map((point) =>
      format(
        new Date(point.timestamp),
        isSmallScreen ? "HH:mm" : "MMM dd HH:mm"
      )
    ),
    dataRange: { start: startIndex, end: endIndex },
    filteredRange: {
      start: highlightRange.start - startIndex,
      end: highlightRange.end - startIndex,
    },
  };
}

export function findTaskByDataIndex(
  index: number,
  forecast: WeatherDataPoint[],
  tasks: Task[],
  selectedTask: Task | null,
  dataRange: { start: number; end: number } | null
): Task | null {
  if (!tasks.length) return null;

  const originalIndex =
    selectedTask && dataRange ? dataRange.start + index : index;
  const clickedData = forecast[originalIndex];

  if (!clickedData) return null;

  const clickedTimestamp = new Date(clickedData.timestamp);

  return (
    tasks.find((task) => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return clickedTimestamp >= taskStart && clickedTimestamp <= taskEnd;
    }) || null
  );
}

export function getWeatherRangeStats(
  forecast: WeatherDataPoint[],
  selectedTask: Task | null,
  highlightRange: { start: number; end: number } | null,
  waveHeights: number[],
  wavePeriods: number[]
) {
  if (selectedTask && highlightRange) {
    const taskData = forecast.slice(
      highlightRange.start,
      highlightRange.end + 1
    );
    return {
      heightMin: Math.min(...taskData.map((point) => point.wave_height)),
      heightMax: Math.max(...taskData.map((point) => point.wave_height)),
      periodMin: Math.min(...taskData.map((point) => point.wave_period)),
      periodMax: Math.max(...taskData.map((point) => point.wave_period)),
    };
  }

  return {
    heightMin: Math.min(...waveHeights),
    heightMax: Math.max(...waveHeights),
    periodMin: Math.min(...wavePeriods),
    periodMax: Math.max(...wavePeriods),
  };
}
