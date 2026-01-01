import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeDefined();
  });

  it("handles onClick events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant classes", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button.classList.contains("bg-destructive")).toBe(true);
  });

  it("shows loading state", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    // Assuming Loader2 renders an svg or similar structure, checking for disabled is a good start.
    // simpler check for now:
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });
});
