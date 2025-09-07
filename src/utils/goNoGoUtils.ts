import type { GoNoGoStatus, Task, WeatherDataPoint } from "src/types";
import { checkTaskFeasibility, getWeatherForTask } from "./weatherUtils";

export function calculateGoNoGoStatuses(
  tasks: Task[],
  weatherForecast: WeatherDataPoint[]
): Record<string, GoNoGoStatus> {
  const statuses: Record<string, GoNoGoStatus> = {};
  tasks.forEach((task) => {
    const taskWeather = getWeatherForTask(weatherForecast, task);
    if (taskWeather) {
      statuses[task.id] = checkTaskFeasibility(task, taskWeather);
    }
  });
  return statuses;
}

export function getGoNoGoStatusText(status: GoNoGoStatus | undefined): string {
  if (!status) return "No Data";

  if (status.canProceed) {
    const isCaution = status.reason.includes("CAUTION");
    return isCaution ? "CAUTION" : "GO";
  } else {
    return "NO-GO";
  }
}

export function getGoNoGoStatusColor(
  status: GoNoGoStatus | undefined
): "success" | "warning" | "error" | "default" {
  if (!status) return "default";

  if (status.canProceed) {
    const isCaution = status.reason.includes("CAUTION");
    return isCaution ? "warning" : "success";
  } else {
    return "error";
  }
}

export function getFormattedGoNoGoReason(status: GoNoGoStatus): string {
  if (!status.canProceed) {
    return `NO-GO: ${status.reason}`;
  }
  return status.reason;
}

export function isGoNoGoCaution(status: GoNoGoStatus): boolean {
  return status.canProceed && status.reason.includes("CAUTION");
}

export function isGoNoGoNoGo(status: GoNoGoStatus): boolean {
  return !status.canProceed;
}
