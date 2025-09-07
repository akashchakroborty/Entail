import type { GoNoGoStatus } from "src/types";
import { describe, expect, it } from "vitest";
import {
  getFormattedGoNoGoReason,
  getGoNoGoStatusColor,
  getGoNoGoStatusText,
  isGoNoGoCaution,
} from "../goNoGoUtils";

describe("goNoGoUtils", () => {
  describe("getGoNoGoStatusText", () => {
    it('should return "GO" for status that can proceed without caution', () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "Weather conditions are favorable",
        taskId: "test-task-1",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getGoNoGoStatusText(status)).toBe("GO");
    });

    it('should return "CAUTION" for status that can proceed with caution', () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "CAUTION: Weather conditions are marginal",
        taskId: "test-task-2",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getGoNoGoStatusText(status)).toBe("CAUTION");
    });

    it('should return "NO-GO" for status that cannot proceed', () => {
      const status: GoNoGoStatus = {
        canProceed: false,
        reason: "Weather conditions exceed limits",
        taskId: "test-task-3",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getGoNoGoStatusText(status)).toBe("NO-GO");
    });

    it('should return "No Data" for undefined status', () => {
      expect(getGoNoGoStatusText(undefined)).toBe("No Data");
    });
  });

  describe("getGoNoGoStatusColor", () => {
    it('should return "success" for status that can proceed without caution', () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "Weather conditions are favorable",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getGoNoGoStatusColor(status)).toBe("success");
    });

    it('should return "warning" for status that can proceed with caution', () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "CAUTION: Weather conditions are marginal",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getGoNoGoStatusColor(status)).toBe("warning");
    });

    it('should return "error" for status that cannot proceed', () => {
      const status: GoNoGoStatus = {
        canProceed: false,
        reason: "Weather conditions exceed limits",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getGoNoGoStatusColor(status)).toBe("error");
    });

    it('should return "default" for undefined status', () => {
      expect(getGoNoGoStatusColor(undefined)).toBe("default");
    });
  });

  describe("getFormattedGoNoGoReason", () => {
    it("should return reason as-is for status that can proceed", () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "Weather conditions are favorable",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getFormattedGoNoGoReason(status)).toBe(
        "Weather conditions are favorable"
      );
    });

    it("should add NO-GO prefix for status that cannot proceed", () => {
      const status: GoNoGoStatus = {
        canProceed: false,
        reason: "Weather conditions exceed limits",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getFormattedGoNoGoReason(status)).toBe(
        "NO-GO: Weather conditions exceed limits"
      );
    });

    it("should handle caution status correctly", () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "CAUTION: Weather conditions are marginal",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(getFormattedGoNoGoReason(status)).toBe(
        "CAUTION: Weather conditions are marginal"
      );
    });
  });

  describe("isGoNoGoCaution", () => {
    it("should return true for status that can proceed with caution", () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "CAUTION: Weather conditions are marginal",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(isGoNoGoCaution(status)).toBe(true);
    });

    it("should return false for status that can proceed without caution", () => {
      const status: GoNoGoStatus = {
        canProceed: true,
        reason: "Weather conditions are favorable",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(isGoNoGoCaution(status)).toBe(false);
    });

    it("should return false for status that cannot proceed", () => {
      const status: GoNoGoStatus = {
        canProceed: false,
        reason: "Weather conditions exceed limits",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(isGoNoGoCaution(status)).toBe(false);
    });

    it("should return false for status that cannot proceed with caution in reason", () => {
      const status: GoNoGoStatus = {
        canProceed: false,
        reason: "CAUTION mentioned but cannot proceed",
        taskId: "test-task",
        timestamp: "2025-09-06T12:00:00Z",
      };
      expect(isGoNoGoCaution(status)).toBe(false);
    });
  });
});
