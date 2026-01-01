import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FloatingActionButton } from "./floating-action-button";
import { Plus } from "lucide-react";

describe("FloatingActionButton", () => {
  it("renders with icon", () => {
    render(<FloatingActionButton icon={<Plus />} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<FloatingActionButton icon={<Plus />} className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("shows label in sr-only", () => {
    render(<FloatingActionButton icon={<Plus />} label="Add Item" />);

    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("uses default Action label when none provided", () => {
    render(<FloatingActionButton icon={<Plus />} />);

    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    render(<FloatingActionButton icon={<Plus />} onClick={onClick} />);

    screen.getByRole("button").click();
    expect(onClick).toHaveBeenCalled();
  });
});
