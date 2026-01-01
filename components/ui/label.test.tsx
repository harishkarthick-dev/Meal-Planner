import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label>Test Label</Label>);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Label className="custom-class">Label</Label>);

    const label = screen.getByText("Label");
    expect(label).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Label ref={ref}>Ref Label</Label>);

    expect(ref.current).not.toBeNull();
  });

  it("applies htmlFor attribute", () => {
    render(<Label htmlFor="test-input">Input Label</Label>);

    const label = screen.getByText("Input Label");
    expect(label).toHaveAttribute("for", "test-input");
  });
});
