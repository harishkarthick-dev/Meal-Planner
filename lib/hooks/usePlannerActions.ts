"use client";

import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { MealEntry, MealType } from "@/types";

export function usePlannerActions() {
  const { user, activeFamilyId } = useAuthStore();

  const addMealToDate = async (
    date: string,
    type: MealType,
    meal: Omit<MealEntry, "id" | "completed">,
  ) => {
    if (!user || !activeFamilyId) return;

    const dayPlanRef = doc(db, "families", activeFamilyId, "dayPlans", date);
    const newEntry: MealEntry = {
      ...meal,
      id: crypto.randomUUID(),
      completed: false,
      mealType: type,
    };

    try {
      await setDoc(
        dayPlanRef,
        {
          id: date,
          date,
          familyId: activeFamilyId,
          updatedAt: Date.now(),
          meals: {
            [type]: arrayUnion(newEntry),
          },
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error adding meal to plan:", error);
      throw error;
    }
  };

  return { addMealToDate };
}
