import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("should merge class names correctly", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional classes", () => {
    expect(cn("bg-red-500", true && "text-white", false && "p-4")).toBe(
      "bg-red-500 text-white",
    );
  });

  it("should merge tailwind classes properly (handling conflicts)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("should handle arrays and undefined/null values", () => {
    expect(cn(["p-4", null, undefined, "text-center"])).toBe("p-4 text-center");
  });
});
