import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppHeader } from "./AppHeader";

// Mock next/navigation
const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock Sidebar to avoid complex rendering
vi.mock("./Sidebar", () => ({
  Sidebar: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="sidebar-mock">
      Sidebar Content
      <button onClick={onClose}>Close Sidebar</button>
    </div>
  ),
}));

// Mock Sheet components to just render children/triggers
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div data-testid="sheet">
      {open && <div data-testid="sheet-open">Open</div>}
      <button onClick={() => onOpenChange(true)} data-testid="sheet-trigger">
        Trigger
      </button>
      {open && children}
    </div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("AppHeader", () => {
  it("renders correctly", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<AppHeader />);
    expect(screen.getByText("MealPlanJoy")).toBeInTheDocument();
  });

  it("displays correct title for Today's Plan", () => {
    mockUsePathname.mockReturnValue("/today");
    render(<AppHeader />);
    expect(screen.getByText("Today's Plan")).toBeInTheDocument();
  });

  it("displays correct title for Weekly Plan", () => {
    mockUsePathname.mockReturnValue("/week");
    render(<AppHeader />);
    expect(screen.getByText("Weekly Plan")).toBeInTheDocument();
  });

  it("displays correct title for Meals Library", () => {
    mockUsePathname.mockReturnValue("/meals");
    render(<AppHeader />);
    expect(screen.getByText("Meals Library")).toBeInTheDocument();
  });

  it("displays correct title for Calendar", () => {
    mockUsePathname.mockReturnValue("/calendar");
    render(<AppHeader />);
    expect(screen.getByText("Calendar")).toBeInTheDocument();
  });

  it("displays correct title for Settings", () => {
    mockUsePathname.mockReturnValue("/settings");
    render(<AppHeader />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("displays correct title for Grocery List", () => {
    mockUsePathname.mockReturnValue("/grocery");
    render(<AppHeader />);
    expect(screen.getByText("Grocery List")).toBeInTheDocument();
  });

  it("opens sidebar when menu button is clicked", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    const { getByTestId } = render(<AppHeader />);

    // Based on our mock, interacting with the trigger logic
    // But since we mocked Sheet heavily, we might just check if the Trigger is there
    // In the real component, SheetTrigger wraps the Button.
    // Our mock renders a button with data-testid="sheet-trigger"

    fireEvent.click(getByTestId("sheet-trigger"));
    expect(getByTestId("sheet-open")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
  });
});
