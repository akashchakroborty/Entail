import { ThemeProvider, createTheme } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WeatherForecast } from "src/components/WeatherForecast/WeatherForecast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  Task,
  WeatherForecast as WeatherForecastType,
} from "../../../types";

const theme = createTheme();

const mockWeatherData: WeatherForecastType = {
  location: {
    lat: 60.5,
    lon: 2.3,
  },
  forecast: [
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
  ],
};

const mockTask: Task = {
  id: "test-task-1",
  name: "Test Task",
  level: 1,
  parentId: "project-1",
  startDate: "2025-01-10T10:00:00.000Z",
  endDate: "2025-01-10T14:00:00.000Z",
  duration: 4,
  weatherLimits: {
    Hs: 2.5,
    Tp: [7.0, 12.0],
  },
};

const mockTasks: Task[] = [mockTask];

vi.mock("@mui/x-charts/BarChart", () => ({
  BarChart: vi.fn(({ onItemClick, series, ...props }) => (
    <div
      data-testid="bar-chart"
      data-series={JSON.stringify(series)}
      onClick={() => onItemClick && onItemClick({}, { dataIndex: 0 })}
      {...props}
    >
      Mocked BarChart
    </div>
  )),
}));

vi.mock("../../../utils/responsiveUtils", () => ({
  useIsMobile: vi.fn(() => false),
  useIsSmallScreen: vi.fn(() => false),
  CARD_HEIGHTS: {
    weatherForecast: {
      xs: 360,
      sm: 400,
      md: 450,
    },
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

describe("WeatherForecast", () => {
  const mockOnTaskSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders weather forecast component", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(screen.getByText("Weather Forecast")).toBeInTheDocument();
    expect(screen.getByText("60.5°N, 2.3°E")).toBeInTheDocument();
  });

  it("displays loading state when loading prop is true", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        loading={true}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
    expect(screen.getByText("Loading weather forecast...")).toBeInTheDocument();
  });

  it("renders wave height and wave period charts", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(screen.getByText("Wave Height (m)")).toBeInTheDocument();
    expect(screen.getByText("Wave Period (s)")).toBeInTheDocument();
    expect(screen.getAllByTestId("bar-chart")).toHaveLength(2);
  });

  it("displays current weather conditions", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(screen.getByText("Current Conditions")).toBeInTheDocument();
    expect(screen.getByText("Wave Height:")).toBeInTheDocument();
    expect(screen.getByText("1.2m")).toBeInTheDocument();
    expect(screen.getByText("Wave Period:")).toBeInTheDocument();
    expect(screen.getByText("8.5s")).toBeInTheDocument();
  });

  it("shows zoom controls when a task is selected", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        selectedTask={mockTask}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(
      screen.getByRole("button", { name: /show full timeline/i })
    ).toBeInTheDocument();
    expect(screen.getByText(`(Zoomed: ${mockTask.name})`)).toBeInTheDocument();
  });

  it("toggles zoom when zoom button is clicked", async () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        selectedTask={mockTask}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    const zoomButton = screen.getByRole("button", {
      name: /show full timeline/i,
    });
    fireEvent.click(zoomButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /zoom to task period/i })
      ).toBeInTheDocument();
    });
  });

  it("displays task-specific range when task is selected", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        selectedTask={mockTask}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(screen.getByText(`Range (${mockTask.name})`)).toBeInTheDocument();
  });

  it("handles empty forecast data gracefully", () => {
    const emptyWeatherData: WeatherForecastType = {
      location: { lat: 60.5, lon: 2.3 },
      forecast: [],
    };

    renderWithTheme(
      <WeatherForecast
        weatherData={emptyWeatherData}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(screen.getByText("Weather Forecast")).toBeInTheDocument();
  });

  it("renders without selected task", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
      />
    );

    expect(screen.queryByText(/Zoomed:/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /zoom/i })
    ).not.toBeInTheDocument();
  });

  it("shows highlighted series when task is selected", () => {
    renderWithTheme(
      <WeatherForecast
        weatherData={mockWeatherData}
        selectedTask={mockTask}
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
    expect(series[1]).toHaveProperty("label", `${mockTask.name} Period`);
    expect(series[1]).toHaveProperty("color", theme.palette.text.primary);
  });
});
