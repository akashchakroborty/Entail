import type { Task, WeatherDataPoint } from "src/types";
import { beforeEach, describe, expect, it } from "vitest";
import {
  checkTaskFeasibility,
  findTaskByDataIndex,
  formatTimestamp,
  getFilteredWeatherData,
  getHighlightedRange,
  getWeatherForTask,
  getWeatherRangeStats,
  isTaskActive,
} from "../weatherUtils";

describe("weatherUtils", () => {
  let mockTask: Task;
  let mockWeatherData: WeatherDataPoint;
  let mockForecast: WeatherDataPoint[];

  beforeEach(() => {
    mockTask = {
      id: "test-task-1",
      name: "INSTALLATION TASK 1",
      level: 0,
      parentId: "",
      startDate: "2025-09-06T12:00:00Z",
      endDate: "2025-09-06T18:00:00Z",
      duration: 1,
      weatherLimits: { Hs: 3.0, Tp: [8, 12] },
    };

    mockWeatherData = {
      timestamp: "2025-09-06T12:00:00Z",
      wave_height: 2.0,
      wave_period: 10.0,
    };

    mockForecast = [
      {
        timestamp: "2025-09-06T10:00:00Z",
        wave_height: 1.8,
        wave_period: 9.0,
      },
      {
        timestamp: "2025-09-06T12:00:00Z",
        wave_height: 2.0,
        wave_period: 10.0,
      },
      {
        timestamp: "2025-09-06T14:00:00Z",
        wave_height: 2.5,
        wave_period: 11.0,
      },
    ];
  });

  describe("checkTaskFeasibility", () => {
    it("should return GO status for good conditions", () => {
      const result = checkTaskFeasibility(mockTask, mockWeatherData);
      expect(result.canProceed).toBe(true);
      expect(result.reason).toContain("GO:");
      expect(result.taskId).toBe(mockTask.id);
      expect(result.timestamp).toBe(mockWeatherData.timestamp);
    });

    it("should return NO-GO for wave height exceeding limit", () => {
      const badWeather = { ...mockWeatherData, wave_height: 3.5 };
      const result = checkTaskFeasibility(mockTask, badWeather);
      expect(result.canProceed).toBe(false);
      expect(result.reason).toContain("Wave height");
      expect(result.reason).toContain("exceeds limit");
    });

    it("should return NO-GO for wave period below minimum", () => {
      const badWeather = { ...mockWeatherData, wave_period: 7.0 };
      const result = checkTaskFeasibility(mockTask, badWeather);
      expect(result.canProceed).toBe(false);
      expect(result.reason).toContain("Wave period");
      expect(result.reason).toContain("outside acceptable range");
    });

    it("should return NO-GO for wave period above maximum", () => {
      const badWeather = { ...mockWeatherData, wave_period: 13.0 };
      const result = checkTaskFeasibility(mockTask, badWeather);
      expect(result.canProceed).toBe(false);
      expect(result.reason).toContain("Wave period");
      expect(result.reason).toContain("outside acceptable range");
    });

    it("should return CAUTION for wave height approaching limit (80%)", () => {
      const cautionWeather = { ...mockWeatherData, wave_height: 2.5 };
      const result = checkTaskFeasibility(mockTask, cautionWeather);
      expect(result.canProceed).toBe(true);
      expect(result.reason).toContain("CAUTION:");
      expect(result.reason).toContain("approaching limit");
    });

    it("should return CAUTION for wave period near boundaries", () => {
      const cautionWeather = { ...mockWeatherData, wave_period: 8.5 };
      const result = checkTaskFeasibility(mockTask, cautionWeather);
      expect(result.canProceed).toBe(true);
      expect(result.reason).toContain("CAUTION:");
      expect(result.reason).toContain("near range limits");
    });

    it("should handle exact limit values", () => {
      const exactLimitWeather = { ...mockWeatherData, wave_height: 3.0 };
      const result = checkTaskFeasibility(mockTask, exactLimitWeather);
      expect(result.canProceed).toBe(false);
      expect(result.reason).toContain("exceeds limit");
    });

    it("should handle exact period boundary values", () => {
      const exactBoundaryWeather = { ...mockWeatherData, wave_period: 8.0 };
      const result = checkTaskFeasibility(mockTask, exactBoundaryWeather);
      expect(result.canProceed).toBe(false);
      expect(result.reason).toContain("outside acceptable range");
    });
  });

  describe("getWeatherForTask", () => {
    it("should return null for empty forecast", () => {
      expect(getWeatherForTask([], mockTask)).toBeNull();
    });

    it("should return the forecast point closest to task start time", () => {
      const result = getWeatherForTask(mockForecast, mockTask);
      expect(result).toEqual(mockForecast[1]);
    });

    it("should find closest match when exact time not available", () => {
      const taskWithDifferentTime = {
        ...mockTask,
        startDate: "2025-09-06T13:00:00Z",
      };
      const result = getWeatherForTask(mockForecast, taskWithDifferentTime);
      expect(result).toEqual(mockForecast[1]);
    });

    it("should handle single forecast point", () => {
      const singleForecast = [mockForecast[0]];
      const result = getWeatherForTask(singleForecast, mockTask);
      expect(result).toEqual(mockForecast[0]);
    });
  });

  describe("formatTimestamp", () => {
    it("should format timestamp correctly", () => {
      const timestamp = "2025-09-06T12:30:00Z";
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/Sep 6/);
      expect(result).toMatch(/12:30/);
    });

    it("should handle different date formats", () => {
      const timestamp = "2025-12-25T08:15:00Z";
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/Dec 25/);
      expect(result).toMatch(/08:15/);
    });
  });

  describe("isTaskActive", () => {
    it("should return true for currently active task", () => {
      const now = new Date();
      const activeTask = {
        ...mockTask,
        startDate: new Date(now.getTime() - 3600000).toISOString(),
        endDate: new Date(now.getTime() + 3600000).toISOString(),
      };
      expect(isTaskActive(activeTask)).toBe(true);
    });

    it("should return false for future task", () => {
      const now = new Date();
      const futureTask = {
        ...mockTask,
        startDate: new Date(now.getTime() + 3600000).toISOString(),
        endDate: new Date(now.getTime() + 7200000).toISOString(),
      };
      expect(isTaskActive(futureTask)).toBe(false);
    });

    it("should return false for past task", () => {
      const now = new Date();
      const pastTask = {
        ...mockTask,
        startDate: new Date(now.getTime() - 7200000).toISOString(),
        endDate: new Date(now.getTime() - 3600000).toISOString(),
      };
      expect(isTaskActive(pastTask)).toBe(false);
    });

    it("should handle exact boundary times", () => {
      const now = new Date();
      const boundaryTask = {
        ...mockTask,
        startDate: now.toISOString(),
        endDate: now.toISOString(),
      };
      expect(isTaskActive(boundaryTask)).toBe(true);
    });
  });

  describe("getHighlightedRange", () => {
    const chartMockForecast: WeatherDataPoint[] = [
      {
        timestamp: "2025-01-10T08:00:00Z",
        wave_height: 1.2,
        wave_period: 8.5,
      },
      {
        timestamp: "2025-01-10T12:00:00Z",
        wave_height: 1.8,
        wave_period: 9.2,
      },
      {
        timestamp: "2025-01-10T16:00:00Z",
        wave_height: 2.1,
        wave_period: 8.8,
      },
      {
        timestamp: "2025-01-10T20:00:00Z",
        wave_height: 1.5,
        wave_period: 9.5,
      },
    ];

    const chartMockTask: Task = {
      id: "task-1",
      name: "Test Task",
      level: 1,
      parentId: "project-1",
      startDate: "2025-01-10T10:00:00Z",
      endDate: "2025-01-10T18:00:00Z",
      duration: 1,
      weatherLimits: {
        Hs: 2.5,
        Tp: [7.0, 12.0],
      },
    };

    it("returns correct range for valid task", () => {
      const result = getHighlightedRange(chartMockTask, chartMockForecast);

      expect(result).toEqual({
        start: 1,
        end: 2,
      });
    });

    it("returns null when no task is provided", () => {
      const result = getHighlightedRange(null, chartMockForecast);
      expect(result).toBeNull();
    });

    it("returns null when no matching forecast data", () => {
      const futureTask: Task = {
        ...chartMockTask,
        startDate: "2025-01-11T10:00:00Z",
        endDate: "2025-01-11T18:00:00Z",
      };

      const result = getHighlightedRange(futureTask, chartMockForecast);
      expect(result).toBeNull();
    });

    it("handles task that extends beyond forecast", () => {
      const longTask: Task = {
        ...chartMockTask,
        startDate: "2025-01-10T10:00:00Z",
        endDate: "2025-01-11T10:00:00Z",
      };

      const result = getHighlightedRange(longTask, chartMockForecast);
      expect(result).toEqual({
        start: 1,
        end: 3,
      });
    });
  });

  describe("getFilteredWeatherData", () => {
    const chartMockForecast: WeatherDataPoint[] = [
      {
        timestamp: "2025-01-10T08:00:00Z",
        wave_height: 1.2,
        wave_period: 8.5,
      },
      {
        timestamp: "2025-01-10T12:00:00Z",
        wave_height: 1.8,
        wave_period: 9.2,
      },
      {
        timestamp: "2025-01-10T16:00:00Z",
        wave_height: 2.1,
        wave_period: 8.8,
      },
      {
        timestamp: "2025-01-10T20:00:00Z",
        wave_height: 1.5,
        wave_period: 9.5,
      },
    ];

    const chartMockTask: Task = {
      id: "task-1",
      name: "Test Task",
      level: 1,
      parentId: "project-1",
      startDate: "2025-01-10T10:00:00Z",
      endDate: "2025-01-10T18:00:00Z",
      duration: 1,
      weatherLimits: {
        Hs: 2.5,
        Tp: [7.0, 12.0],
      },
    };

    const highlightRange = { start: 1, end: 2 };

    it("returns full data when not zoomed", () => {
      const result = getFilteredWeatherData(
        chartMockForecast,
        chartMockTask,
        highlightRange,
        false,
        false
      );

      expect(result.waveHeights).toHaveLength(4);
      expect(result.wavePeriods).toHaveLength(4);
      expect(result.timestamps).toHaveLength(4);
      expect(result.dataRange).toEqual({ start: 0, end: 3 });
    });

    it("returns filtered data when zoomed", () => {
      const result = getFilteredWeatherData(
        chartMockForecast,
        chartMockTask,
        highlightRange,
        true,
        false
      );

      expect(result.waveHeights.length).toBeLessThanOrEqual(4);
      expect(result.dataRange?.start).toBeGreaterThanOrEqual(0);
      expect(result.filteredRange).toBeDefined();
    });

    it("formats timestamps correctly for small screen", () => {
      const result = getFilteredWeatherData(
        chartMockForecast,
        chartMockTask,
        highlightRange,
        false,
        true
      );

      expect(result.timestamps[0]).toMatch(/^\d{2}:\d{2}$/);
    });

    it("formats timestamps correctly for large screen", () => {
      const result = getFilteredWeatherData(
        chartMockForecast,
        chartMockTask,
        highlightRange,
        false,
        false
      );

      expect(result.timestamps[0]).toMatch(/^[A-Za-z]{3} \d{2} \d{2}:\d{2}$/);
    });
  });

  describe("findTaskByDataIndex", () => {
    const chartMockForecast: WeatherDataPoint[] = [
      {
        timestamp: "2025-01-10T08:00:00Z",
        wave_height: 1.2,
        wave_period: 8.5,
      },
      {
        timestamp: "2025-01-10T12:00:00Z",
        wave_height: 1.8,
        wave_period: 9.2,
      },
      {
        timestamp: "2025-01-10T16:00:00Z",
        wave_height: 2.1,
        wave_period: 8.8,
      },
      {
        timestamp: "2025-01-10T20:00:00Z",
        wave_height: 1.5,
        wave_period: 9.5,
      },
    ];

    const chartMockTask: Task = {
      id: "task-1",
      name: "Test Task",
      level: 1,
      parentId: "project-1",
      startDate: "2025-01-10T10:00:00Z",
      endDate: "2025-01-10T18:00:00Z",
      duration: 1,
      weatherLimits: {
        Hs: 2.5,
        Tp: [7.0, 12.0],
      },
    };

    const tasks = [chartMockTask];

    it("finds task by data index correctly", () => {
      const result = findTaskByDataIndex(
        1,
        chartMockForecast,
        tasks,
        null,
        null
      );

      expect(result).toEqual(chartMockTask);
    });

    it("returns null when no tasks provided", () => {
      const result = findTaskByDataIndex(1, chartMockForecast, [], null, null);

      expect(result).toBeNull();
    });

    it("returns null for invalid index", () => {
      const result = findTaskByDataIndex(
        10,
        chartMockForecast,
        tasks,
        null,
        null
      );

      expect(result).toBeNull();
    });

    it("adjusts index when task and dataRange provided", () => {
      const dataRange = { start: 1, end: 3 };
      const result = findTaskByDataIndex(
        0,
        chartMockForecast,
        tasks,
        chartMockTask,
        dataRange
      );

      expect(result).toEqual(chartMockTask);
    });

    it("returns null when timestamp outside task range", () => {
      const earlyTask: Task = {
        ...chartMockTask,
        startDate: "2025-01-10T06:00:00Z",
        endDate: "2025-01-10T07:00:00Z",
      };

      const result = findTaskByDataIndex(
        1,
        chartMockForecast,
        [earlyTask],
        null,
        null
      );

      expect(result).toBeNull();
    });
  });

  describe("getWeatherRangeStats", () => {
    const chartMockForecast: WeatherDataPoint[] = [
      {
        timestamp: "2025-01-10T08:00:00Z",
        wave_height: 1.2,
        wave_period: 8.5,
      },
      {
        timestamp: "2025-01-10T12:00:00Z",
        wave_height: 1.8,
        wave_period: 9.2,
      },
      {
        timestamp: "2025-01-10T16:00:00Z",
        wave_height: 2.1,
        wave_period: 8.8,
      },
      {
        timestamp: "2025-01-10T20:00:00Z",
        wave_height: 1.5,
        wave_period: 9.5,
      },
    ];

    const chartMockTask: Task = {
      id: "task-1",
      name: "Test Task",
      level: 1,
      parentId: "project-1",
      startDate: "2025-01-10T10:00:00Z",
      endDate: "2025-01-10T18:00:00Z",
      duration: 1,
      weatherLimits: {
        Hs: 2.5,
        Tp: [7.0, 12.0],
      },
    };

    const waveHeights = [1.2, 1.8, 2.1, 1.5];
    const wavePeriods = [8.5, 9.2, 8.8, 9.5];
    const highlightRange = { start: 1, end: 2 };

    it("returns task-specific stats when task and range provided", () => {
      const result = getWeatherRangeStats(
        chartMockForecast,
        chartMockTask,
        highlightRange,
        waveHeights,
        wavePeriods
      );

      expect(result.heightMin).toBe(1.8);
      expect(result.heightMax).toBe(2.1);
      expect(result.periodMin).toBe(8.8);
      expect(result.periodMax).toBe(9.2);
    });

    it("returns overall stats when no task selected", () => {
      const result = getWeatherRangeStats(
        chartMockForecast,
        null,
        null,
        waveHeights,
        wavePeriods
      );

      expect(result.heightMin).toBe(1.2);
      expect(result.heightMax).toBe(2.1);
      expect(result.periodMin).toBe(8.5);
      expect(result.periodMax).toBe(9.5);
    });

    it("returns overall stats when no highlight range", () => {
      const result = getWeatherRangeStats(
        chartMockForecast,
        chartMockTask,
        null,
        waveHeights,
        wavePeriods
      );

      expect(result.heightMin).toBe(1.2);
      expect(result.heightMax).toBe(2.1);
      expect(result.periodMin).toBe(8.5);
      expect(result.periodMax).toBe(9.5);
    });
  });
});
