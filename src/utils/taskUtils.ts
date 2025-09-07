import type { Task } from "src/types";

const TASK_DESCRIPTIONS = {
  STORM: "Vessel maintaining position during adverse weather conditions",
  PREP: "Preparation activities for installation operations",
  INSTALLATION: "Active installation of riser components on offshore platform",
  OTHER: "Marine operation visualization",
} as const;

export function getTaskDescription(taskName: string): string {
  const taskType = getTaskType(taskName);

  switch (taskType) {
    case "STORM":
      return TASK_DESCRIPTIONS.STORM;
    case "PREP":
      return TASK_DESCRIPTIONS.PREP;
    case "INSTALLATION":
      return TASK_DESCRIPTIONS.INSTALLATION;
    default:
      return TASK_DESCRIPTIONS.OTHER;
  }
}

export function getTaskDurationText(duration: number): string {
  return `${duration} day${duration !== 1 ? "s" : ""}`;
}

export function getWaveHeightLimitText(limit: number): string {
  return `Wave Height ≤ ${limit}m`;
}

export function getWavePeriodLimitText(range: [number, number]): string {
  return `Period: ${range[0]}-${range[1]}s`;
}

export function sortTasksByStartDate(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export function findTaskById(tasks: Task[], taskId: string): Task | null {
  return tasks.find((task) => task.id === taskId) || null;
}

export function getTaskType(
  taskName: string
): "STORM" | "PREP" | "INSTALLATION" | "OTHER" {
  const keywords = [
    { type: "STORM" as const, keyword: "STORM" },
    { type: "PREP" as const, keyword: "PREP" },
    { type: "INSTALLATION" as const, keyword: "INSTALLATION" },
  ];

  let earliestMatch: {
    type: "STORM" | "PREP" | "INSTALLATION";
    position: number;
  } | null = null;

  for (const { type, keyword } of keywords) {
    const position = taskName.indexOf(keyword);
    if (position !== -1) {
      if (earliestMatch === null || position < earliestMatch.position) {
        earliestMatch = { type, position };
      }
    }
  }

  return earliestMatch ? earliestMatch.type : "OTHER";
}
