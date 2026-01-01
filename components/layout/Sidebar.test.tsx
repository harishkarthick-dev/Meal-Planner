import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";

import type { Mock } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock Link from next/link
// Usually Next.js Link works reasonably well in JSDOM, but if it fails we might need to mock it.
// Let's try without mocking Link first, or assume it renders an anchor tag.
// Actually, strict next/link usage in tests might need a mock if it throws.
// But mostly it just renders <a>.

describe("Sidebar", () => {
  it("renders navigation links", () => {
    (usePathname as Mock).mockReturnValue("/today");
    render(<Sidebar />);

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Meals")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("highlights active link", () => {
    (usePathname as Mock).mockReturnValue("/meals");
    render(<Sidebar />);

    const mealsLink = screen.getByText("Meals").closest("a");
    expect(mealsLink).toHaveClass("bg-primary");
    expect(mealsLink).toHaveClass("text-primary-foreground");

    const weekLink = screen.getByText("Week").closest("a");
    expect(weekLink).not.toHaveClass("bg-primary");
  });
});
