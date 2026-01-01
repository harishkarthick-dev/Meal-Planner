import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility (lib/utils.ts)", () => {
  it("merges class names", () => {
    const result = cn("class1", "class2");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", true && "visible");
    expect(result).toContain("base");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("handles undefined values", () => {
    const result = cn("base", undefined, null, "end");
    expect(result).toBe("base end");
  });

  it("merges tailwind classes correctly", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });
});
