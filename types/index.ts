// Core Data Types

export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Meal {
  id: string;
  familyId?: string; // Optional for migration/flexibility
  name: string;
  description?: string;
  notes?: string;
  ingredients?: string[]; // List of ingredients required
  tags: string[];

  prepTime?: number; // in minutes
  imageURL?: string;
  nutrition?: NutritionData;
  createdBy: string;
  createdAt: number | Timestamp;
}

export interface MealEntry {
  id: string; // unique instance ID
  mealId?: string; // Reference to original meal (if from library)
  name: string;
  mealType: MealType;
  notes?: string;
  nutrition?: NutritionData;
  completed: boolean;
  assignedTo?: string; // userId who is responsible
  completedAt?: number;
}

export interface DayPlan {
  id: string; // YYYY-MM-DD
  date: string;
  familyId: string;
  updatedAt: number | Timestamp;
  mealCount: number;
  meals: {
    breakfast: MealEntry[];
    lunch: MealEntry[];
    snack: MealEntry[];
    dinner: MealEntry[];
  };
}

// User & Family Types

export type FamilyRole = "owner" | "member";

export interface FamilyMember {
  role: FamilyRole;
  joinedAt: number | Timestamp;
  email?: string; // Denormalized for display
  displayName?: string; // Denormalized for display
}

export interface Family {
  id: string;
  name: string;
  ownerId: string;
  createdAt: number | Timestamp;
  inviteCode: string; // Simple code for joining
  members: Record<string, FamilyMember>; // userId -> member details
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  familyIds: string[]; // List of families this user belongs to
  createdAt: number | Timestamp;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  startOfWeek: "monday" | "sunday";
}

export interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
  category?: string; // e.g. "Produce", "Dairy" - optional for now
  sourceMealId?: string; // If added from a specific meal
  addedAt: number | Timestamp;
}
