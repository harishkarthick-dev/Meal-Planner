import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  AuroraBackground,
  FadeIn,
  FadeInStagger,
  FadeInItem,
  ScaleIn,
  ParallaxImage,
} from "./motion";

describe("Motion Components", () => {
  it("exports all components", () => {
    expect(AuroraBackground).toBeDefined();
    expect(FadeIn).toBeDefined();
    expect(FadeInStagger).toBeDefined();
    expect(FadeInItem).toBeDefined();
    expect(ScaleIn).toBeDefined();
    expect(ParallaxImage).toBeDefined();
  });

  it("renders AuroraBackground", () => {
    render(<AuroraBackground>Content</AuroraBackground>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
