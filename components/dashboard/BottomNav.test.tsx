import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomNav } from "./BottomNav";

// Mock next/navigation
const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("BottomNav", () => {
  it("renders all navigation items", () => {
    mockUsePathname.mockReturnValue("/today");
    render(<BottomNav />);

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("List")).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    mockUsePathname.mockReturnValue("/today");
    render(<BottomNav />);

    const todayLink = screen.getByText("Today").closest("a");
    const weekLink = screen.getByText("Week").closest("a");

    expect(todayLink).toHaveClass("text-soft-sage");
    expect(weekLink).toHaveClass("text-stone-400");
  });

  it("handles week route activation", () => {
    mockUsePathname.mockReturnValue("/week");
    render(<BottomNav />);

    const weekLink = screen.getByText("Week").closest("a");
    expect(weekLink).toHaveClass("text-soft-sage");
  });

  it("handles grocery route activation", () => {
    mockUsePathname.mockReturnValue("/grocery");
    render(<BottomNav />);

    const listLink = screen.getByText("List").closest("a");
    expect(listLink).toHaveClass("text-soft-sage");
  });
});
