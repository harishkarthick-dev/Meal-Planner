import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";

describe("ThemeProvider", () => {
  it("renders children correctly", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("passes props to NextThemesProvider", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div>Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
