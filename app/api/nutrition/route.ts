import { NextResponse } from "next/server";
import { nutritionService } from "@/features/nutrition/nutrition.server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const query =
    typeof body === "object" &&
    body !== null &&
    "query" in body &&
    typeof (body as { query: unknown }).query === "string"
      ? (body as { query: string }).query.trim()
      : "";

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const result = await nutritionService.searchFood(query.slice(0, 200));
  return NextResponse.json(result);
}
