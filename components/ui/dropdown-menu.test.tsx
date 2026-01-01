import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";

describe("DropdownMenu Components", () => {
  it("renders basic structure", () => {
    // Basic structural test to ensure components export and render without error
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Checkbox</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="1">
            <DropdownMenuRadioItem value="1">Radio 1</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });
});
