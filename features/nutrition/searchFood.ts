import { EnrichedMealData } from "./types";

export async function searchFood(
  query: string,
): Promise<EnrichedMealData | null> {
  const response = await fetch("/api/nutrition", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as EnrichedMealData | null;
  return payload;
}
