import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KitchenHeader } from "./KitchenHeader";

const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("./CookbookNav", () => ({
  CookbookNav: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="sidebar-mock">
      Sidebar Content
      <button onClick={onClose}>Close Sidebar</button>
    </div>
  ),
  Wordmark: () => <span>Plately</span>,
  chapterTitle: (pathname: string) => {
    if (pathname.includes("/today")) return "Today's table";
    if (pathname.includes("/week")) return "This week";
    if (pathname.includes("/meals")) return "Recipe box";
    if (pathname.includes("/calendar")) return "Calendar";
    if (pathname.includes("/settings")) return "The kitchen";
    if (pathname.includes("/grocery")) return "Market list";
    return "Plately";
  },
}));

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

describe("KitchenHeader", () => {
  it("renders correctly", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<KitchenHeader />);
    expect(screen.getAllByText("Plately").length).toBeGreaterThan(0);
  });

  it("displays correct title for Today's Plan", () => {
    mockUsePathname.mockReturnValue("/today");
    render(<KitchenHeader />);
    expect(screen.getByText("Today's table")).toBeInTheDocument();
  });

  it("displays correct title for Weekly Plan", () => {
    mockUsePathname.mockReturnValue("/week");
    render(<KitchenHeader />);
    expect(screen.getByText("This week")).toBeInTheDocument();
  });

  it("displays correct title for Meals Library", () => {
    mockUsePathname.mockReturnValue("/meals");
    render(<KitchenHeader />);
    expect(screen.getByText("Recipe box")).toBeInTheDocument();
  });

  it("displays correct title for Calendar", () => {
    mockUsePathname.mockReturnValue("/calendar");
    render(<KitchenHeader />);
    expect(screen.getByText("Calendar")).toBeInTheDocument();
  });

  it("displays correct title for Settings", () => {
    mockUsePathname.mockReturnValue("/settings");
    render(<KitchenHeader />);
    expect(screen.getByText("The kitchen")).toBeInTheDocument();
  });

  it("displays correct title for Grocery List", () => {
    mockUsePathname.mockReturnValue("/grocery");
    render(<KitchenHeader />);
    expect(screen.getByText("Market list")).toBeInTheDocument();
  });

  it("opens sidebar when menu button is clicked", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    const { getByTestId } = render(<KitchenHeader />);

    fireEvent.click(getByTestId("sheet-trigger"));
    expect(getByTestId("sheet-open")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
  });
});
