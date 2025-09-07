import { InfoOutlined } from "@mui/icons-material";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "../ErrorState";

describe("ErrorState Component", () => {
  it("renders with default error props", () => {
    render(<ErrorState />);

    expect(screen.getByText("Error Occurred")).toBeInTheDocument();
    expect(
      screen.getByText(
        "There was a problem loading the data. Please try again."
      )
    ).toBeInTheDocument();
  });

  it("renders with custom title and message", () => {
    const title = "Custom Error";
    const message = "Something went wrong with your request";

    render(<ErrorState title={title} message={message} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("renders with warning severity", () => {
    render(<ErrorState severity="warning" />);

    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(
      screen.getByText("There might be an issue with the current data.")
    ).toBeInTheDocument();
  });

  it("renders with info severity", () => {
    render(<ErrorState severity="info" />);

    expect(screen.getByText("Information")).toBeInTheDocument();
    expect(
      screen.getByText("Something needs your attention.")
    ).toBeInTheDocument();
  });

  it("renders with action button and handles click", () => {
    const actionLabel = "Retry";
    const onActionClick = vi.fn();

    render(
      <ErrorState actionLabel={actionLabel} onActionClick={onActionClick} />
    );

    const button = screen.getByText(actionLabel);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it("renders with custom icon", () => {
    render(<ErrorState icon={<InfoOutlined data-testid="custom-icon" />} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders with children content", () => {
    render(
      <ErrorState>
        <div data-testid="child-content">Additional Content</div>
      </ErrorState>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Additional Content")).toBeInTheDocument();
  });

  it("has proper ARIA attributes for accessibility", () => {
    render(<ErrorState />);

    const alertElements = screen.getAllByRole("alert");
    expect(alertElements.length).toBeGreaterThan(0);

    const mainContainer = alertElements.find((element) =>
      element.classList.contains("MuiCard-root")
    );
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveAttribute("aria-live", "assertive");
  });
});
