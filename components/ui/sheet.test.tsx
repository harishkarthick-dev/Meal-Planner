import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SheetHeader, SheetFooter } from "./sheet";

describe("Sheet Components", () => {
  it("renders SheetHeader with children", () => {
    render(<SheetHeader>Header Content</SheetHeader>);
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("renders SheetHeader with custom className", () => {
    const { container } = render(
      <SheetHeader className="custom-header">Header</SheetHeader>,
    );
    expect(container.firstChild).toHaveClass("custom-header");
  });

  it("renders SheetFooter with children", () => {
    render(<SheetFooter>Footer Content</SheetFooter>);
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders SheetFooter with custom className", () => {
    const { container } = render(
      <SheetFooter className="custom-footer">Footer</SheetFooter>,
    );
    expect(container.firstChild).toHaveClass("custom-footer");
  });
});
