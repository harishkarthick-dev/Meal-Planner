import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KitchenDock } from "./KitchenDock";

const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("KitchenDock", () => {
  it("renders all navigation items", () => {
    mockUsePathname.mockReturnValue("/today");
    render(<KitchenDock />);

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getAllByText("Week").length).toBeGreaterThan(0);
    expect(screen.getByText("Market")).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    mockUsePathname.mockReturnValue("/today");
    render(<KitchenDock />);

    const todayLink = screen.getByText("Today").closest("a");
    expect(todayLink).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Week").closest("a")).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("handles week route activation", () => {
    mockUsePathname.mockReturnValue("/week");
    render(<KitchenDock />);

    expect(screen.getByText("Week").closest("a")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("handles grocery route activation", () => {
    mockUsePathname.mockReturnValue("/grocery");
    render(<KitchenDock />);

    expect(screen.getByText("Market").closest("a")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
