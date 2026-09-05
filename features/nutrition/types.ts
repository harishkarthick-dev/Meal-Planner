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
