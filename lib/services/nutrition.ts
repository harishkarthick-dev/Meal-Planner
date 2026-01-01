import { GoogleGenerativeAI } from "@google/generative-ai";
import { NutritionData } from "@/types";

export interface USDAFoodNutrient {
  nutrientName: string;
  value: number;
}

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  foodNutrients: USDAFoodNutrient[];
}

export interface USDASearchResponse {
  foods: USDAFoodItem[];
}

export interface EnrichedMealData {
  nutrition: NutritionData;
  prepTime: number;
  description: string;
  tags: string[];
  ingredients: string[];
}

const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

function generatePrompt(
  userQuery: string,
  foodData: unknown,
  retryCount: number,
): string {
  const basePrompt = `
    User wants nutrition for: "${userQuery}".
    
    Context Data (from USDA Database): 
    ${JSON.stringify(foodData).substring(0, 5000)}...

    TASK:
    Estimate the nutrition for ONE STANDARD SERVING of "${userQuery}".
    - Use the USDA data as a baseline for ingredients if relevant.
    - If the USDA data is incomplete (e.g. user asked for "Idli Sambar" but data is only "Idli"), YOU MUST ESTIMATE the missing components to provide a complete count.
    - If the USDA data is irrelevant, rely on your general knowledge for "${userQuery}".

    RETURN ONLY JSON. NO MARKDOWN. NO COMMENTS.
    Format:
    {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fats": number,
        "prepTime": number,
        "description": "string",
        "tags": ["string"],
        "ingredients": ["string"]
    }
    `;

  if (retryCount === 0) return basePrompt;

  return `
    ${basePrompt}
    
    CRITICAL INSTRUCTION: STICK TO THE FORMAT. PRODUCED JSON ONLY.
    `;
}

async function queryWithGemini(
  query: string,
  contextData: unknown,
): Promise<EnrichedMealData | null> {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

  if (!genAI) return null;

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  let attempts = 0;
  const maxRetries = 3;

  while (attempts <= maxRetries) {
    try {
      const prompt = generatePrompt(query, contextData, attempts);
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleanJson = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed = JSON.parse(cleanJson) as any;

      if (typeof parsed.calories === "number") {
        return {
          nutrition: {
            calories: parsed.calories,
            protein: parsed.protein,
            carbs: parsed.carbs,
            fats: parsed.fats,
          },
          prepTime: parsed.prepTime || 15,
          description: parsed.description || "",
          tags: parsed.tags || [],
          ingredients: parsed.ingredients || [],
        };
      }
    } catch {
      attempts++;
    }
  }

  return null;
}

function extractManualNutrition(food: USDAFoodItem): EnrichedMealData {
  const getNutrient = (name: string) => {
    const nutrient = food.foodNutrients.find((n) =>
      n.nutrientName.toLowerCase().includes(name.toLowerCase()),
    );
    return nutrient ? nutrient.value : 0;
  };

  return {
    nutrition: {
      calories: getNutrient("Energy"),
      protein: getNutrient("Protein"),
      carbs: getNutrient("Carbohydrate"),
      fats: getNutrient("Total lipid (fat)"),
    },
    prepTime: 0,
    description: food.description,
    tags: [],
    ingredients: [],
  };
}

export const nutritionService = {
  async searchFood(query: string): Promise<EnrichedMealData | null> {
    const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY;
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = GEMINI_API_KEY
      ? new GoogleGenerativeAI(GEMINI_API_KEY)
      : null;

    if (!USDA_API_KEY) {
      return null;
    }

    try {
      const response = await fetch(
        `${USDA_API_URL}?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=5`,
      );

      if (!response.ok) throw new Error("USDA API Error");
      const data: USDASearchResponse = await response.json();
      const apiFoods = data.foods || [];

      if (genAI) {
        const aiResult = await queryWithGemini(query, apiFoods);
        if (aiResult) {
          return aiResult;
        }
      }

      if (apiFoods.length > 0) {
        return extractManualNutrition(apiFoods[0]);
      }

      return null;
    } catch {
      if (genAI) {
        return await queryWithGemini(query, []);
      }
      return null;
    }
  },

  queryWithGemini,
  extractManualNutrition,
};
