import { render } from "@testing-library/react";
import { getTaskIcon } from "src/utils/taskIcons";
import { describe, expect, it, vi } from "vitest";

vi.mock("@mui/icons-material", () => ({
  Storm: () => <div data-testid="storm-icon">Storm</div>,
  Engineering: () => <div data-testid="engineering-icon">Engineering</div>,
  Build: () => <div data-testid="build-icon">Build</div>,
  Schedule: () => <div data-testid="schedule-icon">Schedule</div>,
}));

describe("taskIcons", () => {
  describe("getTaskIcon", () => {
    it("should return Storm icon for storm tasks", () => {
      const { getByTestId } = render(getTaskIcon("STORM RIDING"));
      expect(getByTestId("storm-icon")).toBeTruthy();
    });

    it("should return Engineering icon for prep tasks", () => {
      const { getByTestId } = render(getTaskIcon("PREP WORK"));
      expect(getByTestId("engineering-icon")).toBeTruthy();
    });

    it("should return Build icon for installation tasks", () => {
      const { getByTestId } = render(getTaskIcon("INSTALLATION TASK 1"));
      expect(getByTestId("build-icon")).toBeTruthy();
    });

    it("should return Schedule icon for other tasks", () => {
      const { getByTestId } = render(getTaskIcon("MAINTENANCE TASK"));
      expect(getByTestId("schedule-icon")).toBeTruthy();
    });

    it("should return Schedule icon for empty task name", () => {
      const { getByTestId } = render(getTaskIcon(""));
      expect(getByTestId("schedule-icon")).toBeTruthy();
    });

    it("should handle case-sensitive matching", () => {
      const { getByTestId } = render(getTaskIcon("storm riding"));
      expect(getByTestId("schedule-icon")).toBeTruthy();
    });

    it("should handle partial matches correctly", () => {
      const { getByTestId: getByTestId1 } = render(
        getTaskIcon("STORM PREPARATION")
      );
      expect(getByTestId1("storm-icon")).toBeTruthy();

      const { getByTestId: getByTestId2 } = render(
        getTaskIcon("PREP INSTALLATION")
      );
      expect(getByTestId2("engineering-icon")).toBeTruthy();
    });

    it("should return React element", () => {
      const icon = getTaskIcon("STORM RIDING");
      expect(icon).toBeTruthy();
      expect(typeof icon).toBe("object");
      expect(icon.type).toBeDefined();
    });
  });
});
