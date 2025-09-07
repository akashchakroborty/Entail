import type { Task } from "src/types";
import { describe, expect, it } from "vitest";
import {
  findTaskById,
  getTaskDescription,
  getTaskDurationText,
  getTaskType,
  getWaveHeightLimitText,
  getWavePeriodLimitText,
  sortTasksByStartDate,
} from "../taskUtils";

describe("taskUtils", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      name: "STORM RIDING",
      level: 0,
      parentId: "",
      startDate: "2025-09-06T00:00:00Z",
      endDate: "2025-09-07T00:00:00Z",
      duration: 1,
      weatherLimits: { Hs: 3.5, Tp: [8, 12] },
    },
    {
      id: "2",
      name: "INSTALLATION TASK 1",
      level: 0,
      parentId: "",
      startDate: "2025-09-05T00:00:00Z",
      endDate: "2025-09-08T00:00:00Z",
      duration: 3,
      weatherLimits: { Hs: 2.0, Tp: [6, 10] },
    },
    {
      id: "3",
      name: "PREP WORK",
      level: 0,
      parentId: "",
      startDate: "2025-09-08T00:00:00Z",
      endDate: "2025-09-09T00:00:00Z",
      duration: 1,
      weatherLimits: { Hs: 4.0, Tp: [7, 14] },
    },
  ];

  describe("getTaskDescription", () => {
    it("should return storm description for storm tasks", () => {
      expect(getTaskDescription("STORM RIDING")).toBe(
        "Vessel maintaining position during adverse weather conditions"
      );
      expect(getTaskDescription("STORM OPERATION")).toBe(
        "Vessel maintaining position during adverse weather conditions"
      );
    });

    it("should return prep description for prep tasks", () => {
      expect(getTaskDescription("PREP WORK")).toBe(
        "Preparation activities for installation operations"
      );
      expect(getTaskDescription("PREP OPERATION")).toBe(
        "Preparation activities for installation operations"
      );
    });

    it("should return installation description for installation tasks", () => {
      expect(getTaskDescription("INSTALLATION TASK 1")).toBe(
        "Active installation of riser components on offshore platform"
      );
      expect(getTaskDescription("INSTALLATION OPERATION")).toBe(
        "Active installation of riser components on offshore platform"
      );
    });

    it("should return default description for other tasks", () => {
      expect(getTaskDescription("MAINTENANCE TASK")).toBe(
        "Marine operation visualization"
      );
      expect(getTaskDescription("OTHER OPERATION")).toBe(
        "Marine operation visualization"
      );
      expect(getTaskDescription("")).toBe("Marine operation visualization");
    });
  });

  describe("getTaskDurationText", () => {
    it("should return singular form for 1 day", () => {
      expect(getTaskDurationText(1)).toBe("1 day");
    });

    it("should return plural form for multiple days", () => {
      expect(getTaskDurationText(2)).toBe("2 days");
      expect(getTaskDurationText(5)).toBe("5 days");
      expect(getTaskDurationText(10)).toBe("10 days");
    });

    it("should handle zero days", () => {
      expect(getTaskDurationText(0)).toBe("0 days");
    });

    it("should handle decimal values", () => {
      expect(getTaskDurationText(1.5)).toBe("1.5 days");
    });
  });

  describe("getWaveHeightLimitText", () => {
    it("should format wave height limit correctly", () => {
      expect(getWaveHeightLimitText(2.5)).toBe("Wave Height ≤ 2.5m");
      expect(getWaveHeightLimitText(3)).toBe("Wave Height ≤ 3m");
      expect(getWaveHeightLimitText(1.25)).toBe("Wave Height ≤ 1.25m");
    });

    it("should handle zero and very small values", () => {
      expect(getWaveHeightLimitText(0)).toBe("Wave Height ≤ 0m");
      expect(getWaveHeightLimitText(0.1)).toBe("Wave Height ≤ 0.1m");
    });
  });

  describe("getWavePeriodLimitText", () => {
    it("should format wave period range correctly", () => {
      expect(getWavePeriodLimitText([8, 12])).toBe("Period: 8-12s");
      expect(getWavePeriodLimitText([6, 10])).toBe("Period: 6-10s");
      expect(getWavePeriodLimitText([7, 14])).toBe("Period: 7-14s");
    });

    it("should handle same min and max values", () => {
      expect(getWavePeriodLimitText([8, 8])).toBe("Period: 8-8s");
    });

    it("should handle decimal values", () => {
      expect(getWavePeriodLimitText([7.5, 12.5])).toBe("Period: 7.5-12.5s");
    });
  });

  describe("sortTasksByStartDate", () => {
    it("should sort tasks by start date in ascending order", () => {
      const sorted = sortTasksByStartDate(mockTasks);
      expect(sorted[0].name).toBe("INSTALLATION TASK 1");
      expect(sorted[1].name).toBe("STORM RIDING");
      expect(sorted[2].name).toBe("PREP WORK");
    });

    it("should not mutate the original array", () => {
      const original = [...mockTasks];
      sortTasksByStartDate(mockTasks);
      expect(mockTasks).toEqual(original);
    });

    it("should handle empty array", () => {
      expect(sortTasksByStartDate([])).toEqual([]);
    });

    it("should handle single task", () => {
      const singleTask = [mockTasks[0]];
      expect(sortTasksByStartDate(singleTask)).toEqual(singleTask);
    });
  });

  describe("findTaskById", () => {
    it("should find task by ID", () => {
      const found = findTaskById(mockTasks, "2");
      expect(found).toBeTruthy();
      expect(found?.name).toBe("INSTALLATION TASK 1");
    });

    it("should return null for non-existent ID", () => {
      expect(findTaskById(mockTasks, "non-existent")).toBeNull();
    });

    it("should handle empty array", () => {
      expect(findTaskById([], "1")).toBeNull();
    });

    it("should handle empty ID", () => {
      expect(findTaskById(mockTasks, "")).toBeNull();
    });
  });

  describe("getTaskType", () => {
    it("should return correct type for storm tasks", () => {
      expect(getTaskType("STORM RIDING")).toBe("STORM");
      expect(getTaskType("STORM OPERATION")).toBe("STORM");
    });

    it("should return correct type for prep tasks", () => {
      expect(getTaskType("PREP WORK")).toBe("PREP");
      expect(getTaskType("PREP OPERATION")).toBe("PREP");
    });

    it("should return correct type for installation tasks", () => {
      expect(getTaskType("INSTALLATION TASK 1")).toBe("INSTALLATION");
      expect(getTaskType("INSTALLATION OPERATION")).toBe("INSTALLATION");
    });

    it("should return OTHER for unrecognized tasks", () => {
      expect(getTaskType("MAINTENANCE TASK")).toBe("OTHER");
      expect(getTaskType("CUSTOM OPERATION")).toBe("OTHER");
      expect(getTaskType("")).toBe("OTHER");
    });

    it("should prioritize first match for multiple keywords", () => {
      expect(getTaskType("STORM PREP INSTALLATION")).toBe("STORM");
      expect(getTaskType("PREP INSTALLATION STORM")).toBe("PREP");
    });
  });
});
