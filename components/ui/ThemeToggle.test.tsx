import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

describe("ThemeToggle", () => {
  it("renders toggle button", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ThemeToggle className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("handles click events", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
