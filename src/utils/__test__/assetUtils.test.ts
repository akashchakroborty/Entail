import { getTaskImage } from "src/utils/assetUtils";
import { describe, expect, it } from "vitest";

describe("assetUtils", () => {
  describe("getTaskImage", () => {
    it("should return Task1 image for INSTALLATION TASK 1", () => {
      const result = getTaskImage("INSTALLATION TASK 1");
      expect(result).toBeTruthy();
      expect(result).toContain("Task1");
    });

    it("should return Task2 image for INSTALLATION TASK 2", () => {
      const result = getTaskImage("INSTALLATION TASK 2");
      expect(result).toBeTruthy();
      expect(result).toContain("Task2");
    });

    it("should return Task3 image for INSTALLATION TASK 3", () => {
      const result = getTaskImage("INSTALLATION TASK 3");
      expect(result).toBeTruthy();
      expect(result).toContain("Task3");
    });

    it("should return null for non-installation tasks", () => {
      expect(getTaskImage("STORM RIDING")).toBeNull();
      expect(getTaskImage("MAINTENANCE TASK")).toBeNull();
      expect(getTaskImage("OTHER TASK")).toBeNull();
    });

    it("should handle case-sensitive task names", () => {
      expect(getTaskImage("installation task 1")).toBeNull();
      expect(getTaskImage("Installation Task 1")).toBeNull();
    });
  });
});
