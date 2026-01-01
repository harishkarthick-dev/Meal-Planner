"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { db } from "@/lib/firebase/config";
import { GroceryItem, DayPlan, Meal } from "@/types";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export function useGrocery() {
  const { user, activeFamilyId } = useAuthStore();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const familyId = activeFamilyId || "default";

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "families", familyId, "groceryList"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groceries: GroceryItem[] = [];
      snapshot.forEach((doc) => {
        groceries.push({ id: doc.id, ...doc.data() } as GroceryItem);
      });
      groceries.sort((a, b) => {
        if (a.completed === b.completed)
          return (b.addedAt as number) - (a.addedAt as number);
        return a.completed ? 1 : -1;
      });
      setItems(groceries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, familyId]);

  const addItem = async (name: string, category?: string) => {
    if (!user) return;
    const exists = items.some(
      (i) => i.name.toLowerCase() === name.toLowerCase() && !i.completed,
    );
    if (exists) return;

    await addDoc(collection(db, "families", familyId, "groceryList"), {
      name,
      completed: false,
      category: category || "General",
      addedAt: Date.now(),
      createdBy: user.uid,
    });
  };

  const toggleItem = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, "families", familyId, "groceryList", id), {
      completed,
    });
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "families", familyId, "groceryList", id));
  };

  const generateFromRange = async (startDate: Date, endDate: Date) => {
    if (!user) return;

    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");

    const plansQuery = query(
      collection(db, "families", familyId, "dayPlans"),
      where("date", ">=", startStr),
      where("date", "<=", endStr),
    );

    const plansSnapshot = await getDocs(plansQuery);
    const mealIdsToFetch: Set<string> = new Set();

    plansSnapshot.forEach((doc) => {
      const plan = doc.data() as DayPlan;
      const allMeals = [
        ...(plan.meals?.breakfast || []),
        ...(plan.meals?.lunch || []),
        ...(plan.meals?.dinner || []),
        ...(plan.meals?.snack || []),
      ];

      allMeals.forEach((mealEntry) => {
        if (mealEntry.mealId) {
          mealIdsToFetch.add(mealEntry.mealId);
        }
      });
    });

    const mealIds = Array.from(mealIdsToFetch);
    const ingredientsToAdd: string[] = [];

    await Promise.all(
      mealIds.map(async (mealId) => {
        const mealRef = doc(db, "families", familyId, "meals", mealId);
        const snapshot = await getDoc(mealRef);

        if (snapshot.exists()) {
          const meal = snapshot.data() as Meal;
          if (meal.ingredients && Array.isArray(meal.ingredients)) {
            ingredientsToAdd.push(...meal.ingredients);
          }
        }
      }),
    );

    const uniqueIngredients = Array.from(new Set(ingredientsToAdd));
    const existingNames = new Set(items.map((i) => i.name.toLowerCase()));

    for (const name of uniqueIngredients) {
      if (name && !existingNames.has(name.trim().toLowerCase())) {
        await addItem(name.trim(), "Plan");
      }
    }
  };

  return {
    items,
    loading,
    addItem,
    toggleItem,
    deleteItem,
    generateFromRange,
  };
}
