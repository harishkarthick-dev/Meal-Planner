"use client";

import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { DayPlan, MealEntry, MealType } from "@/types";

export function usePlan(date: string) {
  const { user, activeFamilyId } = useAuthStore();
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !activeFamilyId || !date) {
      const timer = setTimeout(() => {
        setDayPlan(null);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const dayPlanRef = doc(db, "families", activeFamilyId, "dayPlans", date);

    const unsubscribe = onSnapshot(
      dayPlanRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const mealsMap = data.meals || {};

          setDayPlan({
            id: data.id || date,
            date: data.date || date,
            familyId: activeFamilyId,
            updatedAt: data.updatedAt || 0,
            mealCount: data.mealCount || 0,
            meals: {
              breakfast: mealsMap.breakfast || data["meals.breakfast"] || [],
              lunch: mealsMap.lunch || data["meals.lunch"] || [],
              snack: mealsMap.snack || data["meals.snack"] || [],
              dinner: mealsMap.dinner || data["meals.dinner"] || [],
            },
          });
        } else {
          setDayPlan({
            id: date,
            date,
            familyId: activeFamilyId,
            updatedAt: 0,
            mealCount: 0,
            meals: {
              breakfast: [],
              lunch: [],
              snack: [],
              dinner: [],
            },
          });
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, activeFamilyId, date]);

  const addMealToDay = async (
    type: MealType,
    meal: Omit<MealEntry, "id" | "completed">,
  ) => {
    if (!user || !activeFamilyId || !date) return;

    const dayPlanRef = doc(db, "families", activeFamilyId, "dayPlans", date);
    const newEntry: MealEntry = {
      ...meal,
      id: crypto.randomUUID(),
      completed: false,
      mealType: type,
    };

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
  };

  const removeMealFromDay = async (type: MealType, entry: MealEntry) => {
    if (!user || !activeFamilyId || !date) return;
    const dayPlanRef = doc(db, "families", activeFamilyId, "dayPlans", date);

    await updateDoc(dayPlanRef, {
      [`meals.${type}`]: arrayRemove(entry),
      updatedAt: Date.now(),
    });
  };

  const toggleMealCompletion = async (type: MealType, entry: MealEntry) => {
    if (!user || !activeFamilyId || !date || !dayPlan) return;

    const currentList = dayPlan.meals[type];
    const updatedList = currentList.map((m) => {
      if (m.id === entry.id) {
        const newCompleted = !m.completed;
        const newEntry: MealEntry = {
          ...m,
          completed: newCompleted,
          completedAt: newCompleted ? Date.now() : undefined,
        };

        if (!newCompleted) {
          delete newEntry.completedAt;
        }
        return newEntry;
      }
      return m;
    });

    const dayPlanRef = doc(db, "families", activeFamilyId, "dayPlans", date);
    await updateDoc(dayPlanRef, {
      [`meals.${type}`]: updatedList,
      updatedAt: Date.now(),
    });
  };

  return {
    dayPlan,
    loading,
    addMealToDay,
    removeMealFromDay,
    toggleMealCompletion,
  };
}
