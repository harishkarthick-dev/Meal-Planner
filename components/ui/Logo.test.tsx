import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders with text by default", () => {
    render(<Logo />);

    expect(screen.getByText("MealPlan")).toBeInTheDocument();
  });

  it("renders without text when showText is false", () => {
    render(<Logo showText={false} />);

    expect(screen.queryByText("MealPlan")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Logo className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders SVG logo icon", () => {
    const { container } = render(<Logo />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
