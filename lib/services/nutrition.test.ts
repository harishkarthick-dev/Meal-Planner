import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nutritionService, USDAFoodItem } from "./nutrition";
import type { Mock } from "vitest";

// Mock GoogleGenerativeAI
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent,
}));

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function () {
      return {
        getGenerativeModel: mockGetGenerativeModel,
      };
    }),
  };
});

// Mock global fetch
const globalFetch = global.fetch;

describe("nutritionService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    global.fetch = globalFetch;
    process.env = originalEnv;
  });

  it("extractManualNutrition parses USDA data correctly", () => {
    // ... existing test
    const mockUSDAFood: USDAFoodItem = {
      fdcId: 123,
      description: "Test Food",
      foodNutrients: [
        { nutrientName: "Energy", value: 100 },
        { nutrientName: "Protein", value: 10 },
        { nutrientName: "Carbohydrate", value: 20 },
        { nutrientName: "Total lipid (fat)", value: 5 },
      ],
    };

    const result = nutritionService.extractManualNutrition(mockUSDAFood);

    expect(result.nutrition.calories).toBe(100);
    expect(result.nutrition.protein).toBe(10);
    expect(result.nutrition.carbs).toBe(20);
    expect(result.nutrition.fats).toBe(5);
    expect(result.description).toBe("Test Food");
  });

  it("searchFood should fetch data and call Gemini if key is present", async () => {
    // ... existing test
    process.env.NEXT_PUBLIC_USDA_API_KEY = "test-usda-key";
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-gemini-key";

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        foods: [{ fdcId: 1, description: "Apple", foodNutrients: [] }],
      }),
    });

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            calories: 95,
            protein: 0.5,
            carbs: 25,
            fats: 0.3,
            prepTime: 5,
            description: "Fresh Apple",
            tags: ["Healthy"],
          }),
      },
    });

    const result = await nutritionService.searchFood("Apple");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api_key=test-usda-key"),
    );
    expect(mockGenerateContent).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(result?.description).toBe("Fresh Apple");
  });

  it("returns null if USDA key is missing", async () => {
    delete process.env.NEXT_PUBLIC_USDA_API_KEY;
    const result = await nutritionService.searchFood("Apple");
    expect(result).toBeNull();
  });

  it("handles USDA API Error by falling back to Gemini", async () => {
    process.env.NEXT_PUBLIC_USDA_API_KEY = "test-usda-key";
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-gemini-key";

    (global.fetch as Mock).mockResolvedValue({
      ok: false,
    });

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ calories: 100 }),
      },
    });

    const result = await nutritionService.searchFood("Apple");
    expect(mockGenerateContent).toHaveBeenCalled();
    expect(result).toBeDefined(); // Falls back to Gemini
  });

  it("handles empty USDA results by falling back to Gemini if available", async () => {
    process.env.NEXT_PUBLIC_USDA_API_KEY = "test-usda-key";
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-gemini-key";

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ foods: [] }),
    });

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ calories: 100 }),
      },
    });

    // searchFood calls queryWithGemini if USDA result empty is handled logic in searchFood?
    // Wait, source says: if (apiFoods.length > 0) return extractManualNutrition... return null.
    // But `try { ... } catch { if (genAI) return queryWithGemini }`.
    // The `if (apiFoods > 0)` block doesn't throw, it returns null.
    // Wait, `searchFood` code:
    /*
    if (genAI) {
      const aiResult = await this.queryWithGemini(query, apiFoods);
      if (aiResult) {
        return aiResult;
      }
    }
    */
    // It calls gemini regardless of USDA emptiness if genAI exists, passing apiFoods as context.
    // Correct.

    await nutritionService.searchFood("Apple");
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it("handles malformed JSON from Gemini by retrying", async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-gemini-key";

    // Mock first attempt failure (malformed), second success
    mockGenerateContent
      .mockResolvedValueOnce({
        response: { text: () => "Invalid JSON" },
      })
      .mockResolvedValueOnce({
        response: {
          text: () =>
            JSON.stringify({ calories: 200, protein: 10, carbs: 10, fats: 5 }),
        },
      });

    const result = await nutritionService.queryWithGemini("Test", []);

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(result?.nutrition.calories).toBe(200);
  });

  it("returns manual extraction if Gemini is missing/fails and USDA has data", async () => {
    process.env.NEXT_PUBLIC_USDA_API_KEY = "test-usda-key";
    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        foods: [
          {
            fdcId: 1,
            description: "USDA Apple",
            foodNutrients: [{ nutrientName: "Energy", value: 50 }],
          },
        ],
      }),
    });

    const result = await nutritionService.searchFood("Apple");
    expect(mockGenerateContent).not.toHaveBeenCalled();
    expect(result?.description).toBe("USDA Apple");
  });
});
