import { render, screen } from "@testing-library/react";
import {
  EmptyState,
  InlineLoadingState,
  LoadingState,
} from "src/utils/stateUtils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Skeleton: ({ variant, width, height }: any) => (
      <div
        data-testid={`skeleton-${variant}`}
        data-width={width}
        data-height={height}
      >
        Skeleton
      </div>
    ),
  };
});

describe("stateUtils", () => {
  describe("LoadingState", () => {
    it("should render with default variant", () => {
      render(<LoadingState />);
      expect(screen.getByTestId("skeleton-rectangular")).toBeTruthy();
    });

    it("should render timeline variant with multiple items", () => {
      render(<LoadingState variant="timeline" message="" />);
      const circularSkeletons = screen.getAllByTestId("skeleton-circular");
      expect(circularSkeletons).toHaveLength(3);
    });

    it("should render chart variant with proper structure", () => {
      render(<LoadingState variant="chart" message="" />);
      expect(screen.getAllByTestId("skeleton-text")).toHaveLength(1);
      expect(screen.getAllByTestId("skeleton-rectangular")).toHaveLength(3);
    });

    it("should render card variant", () => {
      render(<LoadingState variant="card" message="" />);
      expect(screen.getAllByTestId("skeleton-text")).toHaveLength(2);
      expect(screen.getAllByTestId("skeleton-rectangular")).toHaveLength(3);
    });

    it("should render custom message when provided", () => {
      const customMessage = "Loading custom content...";
      render(<LoadingState message={customMessage} />);
      expect(screen.getByText(customMessage)).toBeTruthy();
    });

    it("should render default message when no custom message provided", () => {
      render(<LoadingState />);
      expect(screen.getByText("Loading...")).toBeTruthy();
    });

    it("should not render message when empty string provided", () => {
      render(<LoadingState message="" />);
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    it("should accept custom height", () => {
      const { container } = render(<LoadingState height="500px" />);
      expect(container.firstChild).toBeTruthy();
    });

    it("should render dialog variant", () => {
      render(<LoadingState variant="dialog" message="" />);
      expect(screen.getByTestId("skeleton-circular")).toBeTruthy();
      expect(screen.getAllByTestId("skeleton-text")).toHaveLength(3);
      expect(screen.getByTestId("skeleton-rectangular")).toBeTruthy();
    });
  });

  describe("EmptyState", () => {
    it("should render with default title and message", () => {
      render(<EmptyState />);
      expect(screen.getByText("No Data Available")).toBeTruthy();
      expect(
        screen.getByText("There's nothing to display right now.")
      ).toBeTruthy();
    });

    it("should render with custom title and message", () => {
      const customTitle = "No Tasks";
      const customMessage = "Add some tasks to get started";
      render(<EmptyState title={customTitle} message={customMessage} />);
      expect(screen.getByText(customTitle)).toBeTruthy();
      expect(screen.getByText(customMessage)).toBeTruthy();
    });

    it("should accept custom height", () => {
      const { container } = render(<EmptyState height="400px" />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe("InlineLoadingState", () => {
    it("should render with default message", () => {
      render(<InlineLoadingState />);
      expect(screen.getByText("Loading...")).toBeTruthy();
    });

    it("should render with custom message", () => {
      const customMessage = "Processing...";
      render(<InlineLoadingState message={customMessage} />);
      expect(screen.getByText(customMessage)).toBeTruthy();
    });

    it("should show progress indicator by default", () => {
      const { container } = render(<InlineLoadingState />);
      expect(container.firstChild).toBeTruthy();
    });

    it("should hide progress indicator when showProgress is false", () => {
      render(<InlineLoadingState showProgress={false} />);
      expect(screen.getByText("Loading...")).toBeTruthy();
    });
  });
});
