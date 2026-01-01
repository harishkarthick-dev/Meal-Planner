import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MealCard } from "./MealCard";
import { MealEntry, MealType } from "@/types";

const mockEntry: MealEntry = {
  id: "1",
  name: "Test Meal",
  mealType: "breakfast" as MealType,
  completed: false,
  notes: "Delicious",
};

describe("MealCard", () => {
  it("renders meal information", () => {
    render(
      <MealCard entry={mockEntry} onToggle={() => {}} onRemove={() => {}} />,
    );

    expect(screen.getByText("Test Meal")).toBeDefined();
    expect(screen.getByText("Delicious")).toBeDefined();
  });

  it("calls onToggle when circle icon is clicked", () => {
    const handleToggle = vi.fn();
    render(
      <MealCard
        entry={mockEntry}
        onToggle={handleToggle}
        onRemove={() => {}}
      />,
    );

    // The button wrapping the circle
    const toggleButtons = screen.getAllByRole("button");
    // First button is usually the checkbox toggler, second is delete.
    // BUT better to find by specific characteristic if possible.
    // MealCard has 2 buttons. The first one is for toggle.
    fireEvent.click(toggleButtons[0]);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("renders completed state correctly", () => {
    render(
      <MealCard
        entry={{ ...mockEntry, completed: true }}
        onToggle={() => {}}
        onRemove={() => {}}
      />,
    );

    const title = screen.getByText("Test Meal");
    // Check for line-through class (part of text-muted-foreground line-through)
    expect(title.classList.toString()).toContain("line-through");
  });

  it("calls onRemove when delete button is clicked", () => {
    const handleRemove = vi.fn();
    render(
      <MealCard
        entry={mockEntry}
        onToggle={() => {}}
        onRemove={handleRemove}
      />,
    );

    const buttons = screen.getAllByRole("button");
    // The last button should be the trash button
    const deleteButton = buttons[buttons.length - 1];
    fireEvent.click(deleteButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
