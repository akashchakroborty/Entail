import { ThemeProvider, createTheme } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WeatherForecast } from "src/components/WeatherForecast/WeatherForecast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  Task,
  WeatherForecast as WeatherForecastType,
} from "../../../types";

const theme = createTheme();

const createMockWeatherData = (length = 24): WeatherForecastType => ({
  location: { lat: 60.5, lon: 2.3 },
  forecast: Array.from({ length }, (_, i) => ({
    timestamp: new Date(2025, 0, 10, i).toISOString(),
    wave_height: 1.0 + Math.random() * 2.0,
    wave_period: 8.0 + Math.random() * 4.0,
  })),
});

const createMockTask = (
  id: string,
  startHour: number,
  endHour: number
): Task => ({
  id,
  name: `Task ${id}`,
  level: 1,
  parentId: "project-1",
  startDate: new Date(2025, 0, 10, startHour).toISOString(),
  endDate: new Date(2025, 0, 10, endHour).toISOString(),
  duration: 1,
  weatherLimits: {
    Hs: 2.5,
    Tp: [7.0, 12.0],
  },
});

let mockDataIndex = 10;

vi.mock("@mui/x-charts/BarChart", () => ({
  BarChart: vi.fn(({ onItemClick, series, ...props }) => (
    <div
      data-testid="bar-chart"
      data-series={JSON.stringify(series)}
      onClick={() => {
        if (onItemClick) {
          onItemClick({}, { dataIndex: mockDataIndex });
        }
      }}
      {...props}
    >
      Chart with {series.length} series
    </div>
  )),
}));

vi.mock("../../../utils/responsiveUtils", () => ({
  useIsMobile: vi.fn(() => false),
  useIsSmallScreen: vi.fn(() => false),
  CARD_HEIGHTS: {
    weatherForecast: { xs: 360, sm: 400, md: 450 },
  },
}));

vi.mock("../../../utils/stateUtils", () => ({
  LoadingState: vi.fn(({ message }) => (
    <div data-testid="loading-state">{message}</div>
  )),
}));

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("WeatherForecast Integration Tests", () => {
  let mockWeatherData: WeatherForecastType;
  let mockTasks: Task[];
  let mockOnTaskSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockWeatherData = createMockWeatherData(24);
    mockTasks = [
      createMockTask("task-1", 8, 12),
      createMockTask("task-2", 14, 18),
      createMockTask("task-3", 20, 23),
    ];
    mockOnTaskSelect = vi.fn();
    mockDataIndex = 10;
    vi.clearAllMocks();
  });

  describe("Task Selection and Zoom Behavior", () => {
    it("automatically enables zoom when task is selected", async () => {
      const { rerender } = renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      expect(screen.queryByText(/Zoomed:/)).not.toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <WeatherForecast
            weatherData={mockWeatherData}
            selectedTask={mockTasks[0]}
            tasks={mockTasks}
            onTaskSelect={mockOnTaskSelect}
          />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Zoomed: Task task-1/)).toBeInTheDocument();
      });
    });

    it("toggles between zoomed and full view", async () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          selectedTask={mockTasks[0]}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      const zoomButton = screen.getByRole("button", {
        name: /show full timeline/i,
      });
      expect(zoomButton).toBeInTheDocument();

      fireEvent.click(zoomButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /zoom to task period/i })
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByRole("button", { name: /zoom to task period/i })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /show full timeline/i })
        ).toBeInTheDocument();
      });
    });

    it("updates range statistics when task changes", () => {
      const { rerender } = renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          selectedTask={mockTasks[0]}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      expect(screen.getByText("Range (Task task-1)")).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <WeatherForecast
            weatherData={mockWeatherData}
            selectedTask={mockTasks[1]}
            tasks={mockTasks}
            onTaskSelect={mockOnTaskSelect}
          />
        </ThemeProvider>
      );

      expect(screen.getByText("Range (Task task-2)")).toBeInTheDocument();
    });
  });

  describe("Chart Interaction", () => {
    it("calls onTaskSelect when chart is clicked and matching task found", async () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      const charts = screen.getAllByTestId("bar-chart");
      fireEvent.click(charts[0]);

      expect(mockOnTaskSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      );
    });

    it("does not call onTaskSelect when no matching task found", () => {
      mockDataIndex = 0;

      const earlyWeatherData = createMockWeatherData(4);
      earlyWeatherData.forecast = earlyWeatherData.forecast.map((point, i) => ({
        ...point,
        timestamp: new Date(2025, 0, 9, i).toISOString(),
      }));

      renderWithTheme(
        <WeatherForecast
          weatherData={earlyWeatherData}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      const charts = screen.getAllByTestId("bar-chart");
      fireEvent.click(charts[0]);

      expect(mockOnTaskSelect).not.toHaveBeenCalled();

      mockDataIndex = 10;
    });

    it("does not call onTaskSelect when onTaskSelect prop is not provided", () => {
      renderWithTheme(
        <WeatherForecast weatherData={mockWeatherData} tasks={mockTasks} />
      );

      const charts = screen.getAllByTestId("bar-chart");
      expect(() => fireEvent.click(charts[0])).not.toThrow();
    });
  });

  describe("Chart Series Generation", () => {
    it("generates single series when no task selected", () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      const charts = screen.getAllByTestId("bar-chart");
      const waveHeightChart = charts[0];
      const series = JSON.parse(
        waveHeightChart.getAttribute("data-series") || "[]"
      );

      expect(series).toHaveLength(1);
      expect(series[0]).toHaveProperty("label", "Wave Height");
    });

    it("generates dual series when task is selected", () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          selectedTask={mockTasks[0]}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      const charts = screen.getAllByTestId("bar-chart");
      const waveHeightChart = charts[0];
      const series = JSON.parse(
        waveHeightChart.getAttribute("data-series") || "[]"
      );

      expect(series).toHaveLength(2);
      expect(series[0]).toHaveProperty("label", "Wave Height");
      expect(series[1]).toHaveProperty("label", "Task task-1 Period");
      expect(series[1]).toHaveProperty("color", theme.palette.text.primary);
    });

    it("applies correct colors to series", () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      const charts = screen.getAllByTestId("bar-chart");
      const waveHeightChart = charts[0];
      const wavePeriodChart = charts[1];

      const waveHeightSeries = JSON.parse(
        waveHeightChart.getAttribute("data-series") || "[]"
      );
      const wavePeriodSeries = JSON.parse(
        wavePeriodChart.getAttribute("data-series") || "[]"
      );

      expect(waveHeightSeries[0]).toHaveProperty(
        "color",
        theme.palette.primary.main
      );
      expect(wavePeriodSeries[0]).toHaveProperty(
        "color",
        theme.palette.secondary.main
      );
    });
  });

  describe("Statistics Display", () => {
    it("shows correct current conditions", () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      expect(screen.getByText("Current Conditions")).toBeInTheDocument();
      expect(screen.getByText("Wave Height:")).toBeInTheDocument();
      expect(screen.getByText("Wave Period:")).toBeInTheDocument();

      const firstForecast = mockWeatherData.forecast[0];
      expect(
        screen.getByText(`${firstForecast.wave_height.toFixed(1)}m`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${firstForecast.wave_period.toFixed(1)}s`)
      ).toBeInTheDocument();
    });

    it("updates range display based on selected task", () => {
      const { rerender } = renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      expect(screen.getByText("Range (All Data)")).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <WeatherForecast
            weatherData={mockWeatherData}
            selectedTask={mockTasks[0]}
            tasks={mockTasks}
            onTaskSelect={mockOnTaskSelect}
          />
        </ThemeProvider>
      );

      expect(screen.getByText("Range (Task task-1)")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("shows loading state and hides content when loading", () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          loading={true}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      expect(screen.getByTestId("loading-state")).toBeInTheDocument();
      expect(screen.queryByText("Weather Forecast")).not.toBeInTheDocument();
      expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("shows content when not loading", () => {
      renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          tasks={mockTasks}
          loading={false}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      expect(screen.queryByTestId("loading-state")).not.toBeInTheDocument();
      expect(screen.getByText("Weather Forecast")).toBeInTheDocument();
      expect(screen.getAllByTestId("bar-chart")).toHaveLength(2);
    });
  });

  describe("Performance and Memoization", () => {
    it("does not re-render charts unnecessarily", () => {
      const { rerender } = renderWithTheme(
        <WeatherForecast
          weatherData={mockWeatherData}
          selectedTask={mockTasks[0]}
          tasks={mockTasks}
          onTaskSelect={mockOnTaskSelect}
        />
      );

      const charts = screen.getAllByTestId("bar-chart");
      const initialSeriesData = charts[0].getAttribute("data-series");

      rerender(
        <ThemeProvider theme={theme}>
          <WeatherForecast
            weatherData={mockWeatherData}
            selectedTask={mockTasks[0]}
            tasks={mockTasks}
            onTaskSelect={mockOnTaskSelect}
          />
        </ThemeProvider>
      );

      const newCharts = screen.getAllByTestId("bar-chart");
      const newSeriesData = newCharts[0].getAttribute("data-series");

      expect(newSeriesData).toBe(initialSeriesData);
    });
  });
});
