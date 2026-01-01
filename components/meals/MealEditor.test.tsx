import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MealEditor } from "./MealEditor";
import { Meal } from "@/types";

// Mock dialog components to avoid Radix UI complexity in JSDOM if possible,
// OR just rely on @testing-library/react to handle it.
// Given we tested Dialog separately and it worked, we might be fine.
// But MealEditor uses Dialog internally.

const mockMeal: Meal = {
  id: "1",
  name: "Burger",
  notes: "Tasty",
  prepTime: 15,
  ingredients: [],
  createdAt: 100,
  createdBy: "u1",
  tags: [],
  familyId: "f1",
};

describe("MealEditor", () => {
  it('renders "New Meal" when initialData is not provided', () => {
    render(
      <MealEditor
        open={true}
        onOpenChange={() => {}}
        onSave={async () => {}}
      />,
    );
    expect(screen.getByText("New Meal")).toBeInTheDocument();
  });

  it('renders "Edit Meal" and populates fields when initialData is provided', () => {
    render(
      <MealEditor
        open={true}
        onOpenChange={() => {}}
        initialData={mockMeal}
        onSave={async () => {}}
      />,
    );
    expect(screen.getByText("Edit Meal")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Burger")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tasty")).toBeInTheDocument();
    expect(screen.getByDisplayValue(15)).toBeInTheDocument();
  });

  it("updates state and calls onSave on submit", async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    const handleOpenChange = vi.fn();

    render(
      <MealEditor
        open={true}
        onOpenChange={handleOpenChange}
        onSave={handleSave}
      />,
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Salad" },
    });
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: "Healthy" },
    });
    fireEvent.change(screen.getByLabelText(/Prep/i), {
      target: { value: "10" },
    });

    // Submit
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith({
        name: "Salad",
        notes: "Healthy",
        prepTime: 10,
        tags: [],
        ingredients: [],
      });
    });

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles validation (name is required)", async () => {
    const handleSave = vi.fn();
    render(
      <MealEditor open={true} onOpenChange={() => {}} onSave={handleSave} />,
    );

    // Try to submit without name
    // The browser validation "required" attribute usually prevents submission,
    // but JSDOM implementation of fireEvent.submit might bypass or need check.
    // Radix Button type="submit" inside a form.

    const submitBtn = screen.getByText("Save changes");
    fireEvent.click(submitBtn);

    // handleSave should not be called because name is empty
    // However, standard HTML5 validation might not stop the event in JSDOM unless we check valid validity.
    // Our component check: if (!formData.name) return;

    await waitFor(() => {
      expect(handleSave).not.toHaveBeenCalled();
    });
  });
});
