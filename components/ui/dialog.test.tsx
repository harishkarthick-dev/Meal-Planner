import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "./dialog";

// Radix UI Dialog portal renders outside the root container in tests,
// so we might need to rely on locating by text or role in document.body
// but usually RTL handles it if we use screen queries.

describe("Dialog", () => {
  it("renders trigger and opens dialog on click", () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Content</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByText("Open");
    expect(trigger).toBeInTheDocument();

    // Dialog content should not be visible yet
    expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();

    fireEvent.click(trigger);

    // Now it should be visible
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog Content")).toBeInTheDocument();
  });

  it("validates DialogHeader and DialogFooter rendering", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Header</DialogTitle>
          </DialogHeader>
          <div>Body</div>
          <DialogFooter>
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
