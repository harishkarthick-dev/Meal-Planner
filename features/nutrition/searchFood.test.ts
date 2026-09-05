import { describe, it, expect, vi, afterEach } from "vitest";
import { searchFood } from "./searchFood";

describe("searchFood (client)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts to the nutrition route handler", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        nutrition: { calories: 90, protein: 1, carbs: 20, fats: 0 },
        prepTime: 5,
        description: "Apple",
        tags: [],
        ingredients: ["apple"],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await searchFood("Apple");

    expect(fetchMock).toHaveBeenCalledWith("/api/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Apple" }),
    });
    expect(result?.description).toBe("Apple");
  });

  it("returns null when the route fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => null }),
    );

    await expect(searchFood("Mystery stew")).resolves.toBeNull();
  });
});
